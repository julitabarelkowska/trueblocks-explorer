/* eslint-disable @typescript-eslint/no-unused-vars, no-restricted-globals */

import { expose } from 'comlink';
import { address as Address, getNames, Name } from 'trueblocks-sdk';

import { applyTransactionFilters, TransactionFilters } from '@modules/filters/transaction';

import {
  CancelLoadTransactions,
  GetActiveFilters,
  GetChartItems,
  GetEventsItems,
  GetFunctionsItems,
  GetGas,
  GetNameFor,
  GetNeighbors,
  GetPage,
  GetTransactionsTotal,
  SetActiveFilters,
} from '../messages';
import * as Names from './names';
import * as Store from './store';
import * as Transactions from './transactions';
import { readWholeStream } from './utils/stream';

// Following three lines are required to enable global `connect` function,
// which in turn is needed for the worker to successfully register itself
export { };
declare global {
  function onconnect(e: MessageEvent): void
}

const streamsToCancel: Set<Address> = new Set();

type WorkerApi = {
  loadNames: (options: Parameters<typeof getNames>[0]) => Promise<{ total: number }>,
  getNameFor: (options: GetNameFor) => Name | undefined,
  loadTransactions: (
    options: {
      chain: string, address: string,
    },
    callback: (state: { new: number, total: number, filtered: number }) => void,
    onDone?: () => void,
  ) => Promise<void>,
  cancelLoadTransactions: (options: CancelLoadTransactions) => void,
  getTransactionsTotal: (options: GetTransactionsTotal) => ReturnType<typeof Transactions.getTransactionsTotal>,
  getPage: (options: GetPage) => ReturnType<typeof Transactions.getPage>,
  getChartItems: (options: GetChartItems) => ReturnType<typeof Transactions.getChartItems>,
  getEventsItems: (options: GetEventsItems) => ReturnType<typeof Transactions.getEventsItems>,
  getFunctionsItems: (options: GetFunctionsItems) => ReturnType<typeof Transactions.getFunctionsItems>,
  getGas: (options: GetGas) => ReturnType<typeof Transactions.getGas>,
  getNeighbors: (options: GetNeighbors) => ReturnType<typeof Transactions.getNeighbors>,

  setActiveFilters: (options: SetActiveFilters) => Boolean,
  getActiveFilters: (options: GetActiveFilters) => TransactionFilters | null,
  clearPerAccountStores: () => void,
};
export const api: WorkerApi = {
  // Names
  async loadNames(options) {
    const names = await Names.fetchAll(options);
    const total = Store.replaceNames(names);

    return { total };
  },
  getNameFor({ address }) {
    return Store.getNameFor(address);
  },

  // Transactions
  async loadTransactions({ chain, address }, callback, onDone = () => { }) {
    const stream = Transactions.fetchAll(chain, [address], Store.getNameFor);

    try {
      await readWholeStream(
        stream,
        async (transactions) => {
          const total = Store.appendTransactions(chain, address, transactions);
          const activeFilters = Store.getActiveFilters(chain, address);
          const transactionFilter = activeFilters ? applyTransactionFilters(activeFilters) : undefined;
          let newLength = 0;

          if (transactionFilter) {
            const filtered = transactions.filter(transactionFilter);
            newLength = Store.appendFilteredTransactions(chain, address, filtered);
          }

          await callback({
            new: transactions.length,
            total,
            filtered: newLength,
          });
        },
        onDone,
        () => streamsToCancel.has(address),
      );
    } finally {
      streamsToCancel.delete(address);
    }
  },
  cancelLoadTransactions({ chain, address }) {
    streamsToCancel.add(`${chain}:${address}`);
  },
  getTransactionsTotal({ chain, addresses }) {
    return Transactions.getTransactionsTotal(
      chain,
      addresses,
    );
  },
  getPage({
    chain, address, page, pageSize, filtered,
  }) {
    if (filtered) {
      const filteredResults = Store.getFilteredTransactionsFor(chain, address);
      if (!filteredResults) return { page, items: [], knownTotal: 0 };

      const pageStart = ((page - 1) * pageSize);
      return {
        page,
        items: filteredResults.slice(pageStart, pageStart + pageSize),
        knownTotal: filteredResults.length,
      };
    }

    return Transactions.getPage(Store.getTransactionsFor, {
      chain,
      address,
      page,
      pageSize,
    });
  },
  getChartItems({ chain, address, ...options }) {
    const transactions = Store.getTransactionsFor(chain, address);

    return Transactions.getChartItems(transactions, options);
  },
  getEventsItems({ chain, address }) {
    const transactions = Store.getTransactionsFor(chain, address);

    return Transactions.getEventsItems(transactions);
  },
  getFunctionsItems({ chain, address }) {
    const transactions = Store.getTransactionsFor(chain, address);

    return Transactions.getFunctionsItems(transactions);
  },
  getGas({ chain, address }) {
    const transactions = Store.getTransactionsFor(chain, address);

    return Transactions.getGas(transactions, Store.getNameFor);
  },
  getNeighbors({ chain, address }) {
    const transactions = Store.getTransactionsFor(chain, address);

    return Transactions.getNeighbors(transactions);
  },

  // Filters
  setActiveFilters({ chain, address, filters }) {
    Store.setActiveFilters(chain, address, filters);
    const allTransactions = Store.getTransactionsFor(chain, address);

    if (!allTransactions) return false;

    const filtered = allTransactions.filter(applyTransactionFilters(filters));
    Store.replaceFilteredTransactions(chain, address, filtered);
    return true;
  },

  getActiveFilters({ chain, address }) {
    const filters = Store.getActiveFilters(chain, address);

    if (!filters) return null;

    const assetName = 'asset' in filters ? Store.getNameFor(filters.asset) : undefined;

    return {
      ...filters,
      ...(assetName ? { asset: assetName.name } : {}),
    };
  },

  clearPerAccountStores() {
    Store.clearPerAccountStores();
  },
};

self.onconnect = async function connectionHandler({ ports }: MessageEvent) {
  const port = ports[0];
  expose(api, port);
  port.start();
};
