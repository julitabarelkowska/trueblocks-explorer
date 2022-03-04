/* eslint-disable @typescript-eslint/no-unused-vars, no-restricted-globals */

import { DataStoreMessage } from '../messages';
import * as Store from './store';
import * as Transactions from './transactions';
import { readWholeStream } from './utils/stream';

// Following three lines are required to enable global `connect` function,
// which in turn is needed for the worker to successfully register itself
export { };
declare global {
  function onconnect(e: MessageEvent): void
}

self.onconnect = function connectionHandler({ ports }: MessageEvent) {
  const port = ports[0];

  port.addEventListener('message', async ({ data }) => {
    try {
      const message: DataStoreMessage = data;

      console.log('[ worker ]: got message', message);
      const result = dispatch(message, port);

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

function dispatch(message: DataStoreMessage, port: MessagePort) {
  if (message.call === 'loadTransactions') {
    const stream = Transactions.fetchAll('mainnet', [message.args.address]);

    readWholeStream(
      stream,
      (transactions) => {
        const total = Store.append(message.args.address, transactions);
        port.postMessage({ call: message.call, result: { new: transactions.length, total } });
      },
    );
  }

  if (message.call === 'getPage') {
    const {
      address,
      page,
      pageSize,
    } = message.args;

    return Transactions.getPage(Store.getBy, {
      address,
      page,
      pageSize,
    });
  }

  return undefined;
}
