/* eslint-disable @typescript-eslint/no-unused-vars, no-restricted-globals */

import { address as Address, getNames, Name } from '@sdk';
import { expose } from 'comlink';

import {
  CancelLoadTransactions, DataStoreMessage, GetChartItems, GetChartItemsResult, GetEventsItems, GetEventsItemsResult, GetFunctionsItems, GetFunctionsItemsResult, GetGas, GetGasResult, GetNameFor, GetNameForResult, GetNeighbors, GetNeighborsResult, GetPage, GetPageResult, GetSlice, GetSliceResult, GetTransactionsTotal, GetTransactionsTotalResult, LoadNames, LoadNamesResult, LoadTransactions,
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
  getNameFor: (options: GetNameFor['args']) => Name | undefined,
  loadTransactions: (options: {
    chain: string, address: string,
  }, callback: (state: { new: number, total: number }) => void) => Promise<void>,
  cancelLoadTransactions: (options: CancelLoadTransactions['args']) => void,
  getTransactionsTotal: (options: GetTransactionsTotal['args']) => ReturnType<typeof Transactions.getTransactionsTotal>,
  getPage: (options: GetPage['args']) => ReturnType<typeof Transactions.getPage>,
  getSlice: (options: GetSlice['args']) => ReturnType<typeof Transactions.getSlice>,
  getChartItems: (options: GetChartItems['args']) => ReturnType<typeof Transactions.getChartItems>,
  getEventsItems: (options: GetEventsItems['args']) => ReturnType<typeof Transactions.getEventsItems>,
  getFunctionsItems: (options: GetFunctionsItems['args']) => ReturnType<typeof Transactions.getFunctionsItems>,
  getGas: (options: GetGas['args']) => ReturnType<typeof Transactions.getGas>,
  getNeighbors: (options: GetNeighbors['args']) => ReturnType<typeof Transactions.getNeighbors>,
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
  async loadTransactions({ chain, address }, callback) {
    const stream = Transactions.fetchAll(chain, [address], Store.getNameFor);

    try {
      await readWholeStream(
        stream,
        async (transactions) => {
          const total = Store.appendTransactions(address, transactions);
          await callback({ new: transactions.length, total });
        },
        () => { },
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
  getTransactionsTotal({ chain, addresses }) {
    return Transactions.getTransactionsTotal(
      chain,
      addresses,
    );
  },
  getPage({ address, page, pageSize }) {
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
};

self.onconnect = async function connectionHandler({ ports }: MessageEvent) {
  const port = ports[0];
  expose(api, port);
  port.start();
};
