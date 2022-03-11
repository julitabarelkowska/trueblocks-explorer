/* eslint-disable @typescript-eslint/no-unused-vars, no-restricted-globals */

import { DataStoreMessage } from '../messages';
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

async function dispatch(message: DataStoreMessage, port: MessagePort) {
  // Names

  if (message.call === 'loadNames') {
    const names = await Names.fetchAll(message.args);
    const total = Store.replaceNames(names);

    return { total };
  }

  // Transactions

  if (message.call === 'loadTransactions') {
    const stream = Transactions.fetchAll('mainnet', [message.args.address]);

    readWholeStream(
      stream,
      (transactions) => {
        const total = Store.appendTransactions(message.args.address, transactions);
        port.postMessage({ call: message.call, result: { new: transactions.length, total } });
      },
    );
  }

  if (message.call === 'getTransactionsTotal') {
    return Transactions.getTransactionsTotal(message.args.chain, message.args.addresses);
  }

  if (message.call === 'getPage') {
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
  }

  if (message.call === 'getChartItems') {
    const { address, ...options } = message.args;
    const transactions = Store.getTransactionsFor(address);

    return Transactions.getChartItems(transactions, options);
  }

  return undefined;
}
