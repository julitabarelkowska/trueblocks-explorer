/* eslint-disable @typescript-eslint/no-unused-vars, no-restricted-globals */

import { address as Address, getNames, Name } from '@sdk';
import { expose } from 'comlink';

import { TransactionFilters } from '@modules/filters/transaction';

import {
  CancelLoadTransactions, DataStoreMessage, GetActiveFilters, GetChartItems, GetChartItemsResult, GetEventsItems, GetEventsItemsResult, GetFunctionsItems, GetFunctionsItemsResult, GetGas, GetGasResult, GetNameFor, GetNameForResult, GetNeighbors, GetNeighborsResult, GetPage, GetPageResult, GetSlice, GetSliceResult, GetTransactionsTotal, GetTransactionsTotalResult, LoadNames, LoadNamesResult, LoadTransactions, SetActiveFilters,
} from '../messages';
import { applyTransactionFilters } from './filters';
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
  getNameFor: (options: GetNameFor['args']) => Name | undefined,
  loadTransactions: (
    options: {
      chain: string, address: string,
    },
    callback: (state: { new: number, total: number, filtered: number }) => void,
    onDone?: () => void,
  ) => Promise<void>,
  cancelLoadTransactions: (options: CancelLoadTransactions['args']) => void,
  getTransactionsTotal: (options: GetTransactionsTotal['args']) => ReturnType<typeof Transactions.getTransactionsTotal>,
  getPage: (options: GetPage['args']) => ReturnType<typeof Transactions.getPage>,
  getSlice: (options: GetSlice['args']) => ReturnType<typeof Transactions.getSlice>,
  getChartItems: (options: GetChartItems['args']) => ReturnType<typeof Transactions.getChartItems>,
  getEventsItems: (options: GetEventsItems['args']) => ReturnType<typeof Transactions.getEventsItems>,
  getFunctionsItems: (options: GetFunctionsItems['args']) => ReturnType<typeof Transactions.getFunctionsItems>,
  getGas: (options: GetGas['args']) => ReturnType<typeof Transactions.getGas>,
  getNeighbors: (options: GetNeighbors['args']) => ReturnType<typeof Transactions.getNeighbors>,

  setActiveFilters: (options: SetActiveFilters['args']) => Boolean,
  getActiveFilters: (options: GetActiveFilters['args']) => TransactionFilters | null,
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
          const total = Store.appendTransactions(address, transactions);
          const activeFilters = Store.getActiveFiltersStore().get(address);
          const transactionFilter = activeFilters ? applyTransactionFilters(activeFilters) : undefined;

          if (transactionFilter) {
            const filtered = transactions.filter(transactionFilter);
            const alreadyPresent = Store.getFilteredTransactionsStore().get(address) || [];

            Store.getFilteredTransactionsStore().set(address, [...alreadyPresent, ...filtered]);
          }

          await callback({
            new: transactions.length,
            total,
            filtered: Number(Store.getFilteredTransactionsStore().get(address)?.length),
          });
        },
        onDone,
        () => streamsToCancel.has(address),
      );
    } finally {
      streamsToCancel.delete(address);
    }
  },
  // TODO: support chain
  cancelLoadTransactions({ address }) {
    streamsToCancel.add(address);
  },
  getTransactionsTotal({ chain, addresses, filtered }) {
    // if (filtered) {
    //   const r = addresses
    //     .filter((address) => Store.getFilteredTransactionsStore().get(address) !== undefined);

    //   if (!r.length) {
    //     return Promise.resolve(addresses.map((address) => ({
    //       address,
    //       fileSize: 0,
    //       nRecords: 0,
    //     })));
    //   }

    //   return Promise.resolve(
    //     r
    //       .map((address) => ({
    //         address,
    //         fileSize: 0,
    //         // @ts-ignore
    //         nRecords: Store.getFilteredTransactionsStore().get(address).length,
    //       })),
    //   );
    // }

    return Transactions.getTransactionsTotal(
      chain,
      addresses,
    );
  },
  getPage({
    address, page, pageSize, filtered,
  }) {
    if (filtered) {
      const filteredResults = Store.getFilteredTransactionsStore().get(address);
      console.log('Getting filtered page', filteredResults?.length);
      if (!filteredResults) return { page, items: [], knownTotal: 0 };

      const pageStart = ((page - 1) * pageSize);
      return {
        page,
        items: filteredResults.slice(pageStart, pageStart + pageSize),
        knownTotal: filteredResults.length,
      };
    }

    return Transactions.getPage(Store.getTransactionsFor, {
      address,
      page,
      pageSize,
    });
  },
  getSlice({ address, start, end }) {
    return Transactions.getSlice(Store.getTransactionsFor, {
      address,
      start,
      end,
    });
  },
  getChartItems({ address, ...options }) {
    const transactions = Store.getTransactionsFor(address);

    return Transactions.getChartItems(transactions, options);
  },
  getEventsItems({ address }) {
    const transactions = Store.getTransactionsFor(address);

    return Transactions.getEventsItems(transactions);
  },
  getFunctionsItems({ address }) {
    const transactions = Store.getTransactionsFor(address);

    return Transactions.getFunctionsItems(transactions);
  },
  getGas({ address }) {
    const transactions = Store.getTransactionsFor(address);

    // TODO: FIXME!
    return Transactions.getGas(transactions, new Map([]));
  },
  getNeighbors({ address }) {
    const transactions = Store.getTransactionsFor(address);

    return Transactions.getNeighbors(transactions);
  },

  // Filters
  setActiveFilters({ address, filters }) {
    Store.getActiveFiltersStore().set(address, filters);
    console.log('Setting filters to', filters);

    const allTransactions = Store.getTransactionsFor(address);

    if (!allTransactions) return false;

    const filtered = allTransactions.filter(applyTransactionFilters(filters));
    console.log('>>>', filtered.length);
    Store.getFilteredTransactionsStore().set(address, filtered);
    return true;
  },

  // TODO: not sure if it's needed
  getActiveFilters({ address }) {
    const filters = Store.getActiveFiltersStore().get(address);

    if (!filters) return null;

    const assetName = 'asset' in filters ? Store.getNameFor(filters.asset) : undefined;

    return {
      ...filters,
      ...(assetName ? { asset: assetName.name } : {}),
    };
  },
};

self.onconnect = async function connectionHandler({ ports }: MessageEvent) {
  const port = ports[0];
  expose(api, port);
  port.start();
};
