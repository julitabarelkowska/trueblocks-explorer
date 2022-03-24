/* eslint-disable @typescript-eslint/no-unused-vars, no-restricted-globals */

import { address as Address } from '@sdk';

import {
  CancelLoadTransactions, DataStoreMessage, GetChartItems, GetChartItemsResult, GetEventsItems, GetEventsItemsResult, GetFunctionsItems, GetFunctionsItemsResult, GetGas, GetGasResult, GetNeighbors, GetNeighborsResult, GetPage, GetPageResult, GetTransactionsTotal, GetTransactionsTotalResult, LoadNames, LoadNamesResult, LoadTransactions,
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

self.onconnect = async function connectionHandler({ ports }: MessageEvent) {
  const port = ports[0];

  port.addEventListener('message', async ({ data }) => {
    try {
      const message: DataStoreMessage = data;

      console.log('[ worker ]: got message', message);
      const result = await dispatch(message, port);

      if (result) {
        port.postMessage({ call: message.call, result });
      }
    } catch (err) {
      port.postMessage({ call: 'error', result: err });
      throw err;
    }
  });

  port.start();
};

type MessageHandler<MessageType, ReturnValue> = (message: MessageType, port: MessagePort) => Promise<ReturnValue>;

const loadNames: MessageHandler<LoadNames, LoadNamesResult> = async (message) => {
  const names = await Names.fetchAll(message.args);
  const total = Store.replaceNames(names);

  return { total };
};

const loadTransactions: MessageHandler<LoadTransactions, void> = async (message, port) => {
  const stream = Transactions.fetchAll('mainnet', [message.args.address]);

  try {
    await readWholeStream(
      stream,
      (transactions) => {
        const total = Store.appendTransactions(message.args.address, transactions);
        port.postMessage({ call: message.call, result: { new: transactions.length, total } });
      },
      () => { },
      () => streamsToCancel.has(message.args.address),
    );
  } finally {
    streamsToCancel.delete(message.args.address);
  }
};

const cancelLoadTransactions: MessageHandler<CancelLoadTransactions, void> = async (message) => {
  streamsToCancel.add(message.args.address);
};

const getTransactionsTotal: MessageHandler<GetTransactionsTotal, GetTransactionsTotalResult> = async (message) => Transactions.getTransactionsTotal(
  message.args.chain,
  message.args.addresses,
);

const getPage: MessageHandler<GetPage, GetPageResult> = async (message) => {
  const {
    address,
    page,
    pageSize,
  } = message.args;

  return Transactions.getPage(Store.getTransactionsFor, {
    address,
    page,
    pageSize,
  });
};

const getChartItems: MessageHandler<GetChartItems, GetChartItemsResult> = async (message) => {
  const { address, ...options } = message.args;
  const transactions = Store.getTransactionsFor(address);

  return Transactions.getChartItems(transactions, options);
};

const getEventsItems: MessageHandler<GetEventsItems, GetEventsItemsResult> = async (message) => {
  const { address } = message.args;
  const transactions = Store.getTransactionsFor(address);

  return Transactions.getEventsItems(transactions);
};

const getFunctionsItems: MessageHandler<GetFunctionsItems, GetFunctionsItemsResult> = async (message) => {
  const { address } = message.args;
  const transactions = Store.getTransactionsFor(address);

  return Transactions.getFunctionsItems(transactions);
};

const getGas: MessageHandler<GetGas, GetGasResult> = async (message) => {
  const { address } = message.args;
  const transactions = Store.getTransactionsFor(address);

  // TODO: FIXME!
  return Transactions.getGas(transactions, new Map([]));
};

const getNeighbors: MessageHandler<GetNeighbors, GetNeighborsResult> = async (message) => {
  const { address } = message.args;
  const transactions = Store.getTransactionsFor(address);

  return Transactions.getNeighbors(transactions);
};

async function dispatch(message: DataStoreMessage, port: MessagePort) {
  const result = await (async () => {
    if (message.call === 'loadNames') return loadNames(message, port);
    if (message.call === 'loadTransactions') return loadTransactions(message, port);
    if (message.call === 'getTransactionsTotal') return getTransactionsTotal(message, port);
    if (message.call === 'cancelLoadTransactions') return cancelLoadTransactions(message, port);
    if (message.call === 'getPage') return getPage(message, port);
    if (message.call === 'getChartItems') return getChartItems(message, port);
    if (message.call === 'getEventsItems') return getEventsItems(message, port);
    if (message.call === 'getFunctionsItems') return getFunctionsItems(message, port);
    if (message.call === 'getGas') return getGas(message, port);
    if (message.call === 'getNeighbors') return getNeighbors(message, port);

    throw new Error('Unrecognized message');
  })();

  return result;
}
