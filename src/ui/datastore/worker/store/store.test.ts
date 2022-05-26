import { Transaction } from '@sdk';

import * as Store from '.';

const getTransaction = () => ({
  hash: '0xf9a328dcbaf8cbd4fdf58889a0544198983ad2eaec7ccf3e711ecb30348f6d70',
  blockHash: '0x807b19e555c031fe44bd183fbcf1c34eea301d8553fef8be1bc63245fbaabcd5',
  blockNumber: 12147043,
  transactionIndex: 68,
  timestamp: 1617192715,
  from: '0xf503017d7baf7fbc0fff7492b751025c6a78179b',
  to: '0x6b175474e89094c44da98b954eedeac495271d0f',
  value: '0',
  gas: '78009',
  gasPrice: '133000000000',
  maxFeePerGas: 0,
  maxPriorityFeePerGas: 0,
  isError: false,
  hasToken: true,
  receipt: {
    contractAddress: '0x0',
    gasUsed: '52006',
    effectiveGasPrice: 133000000000,
    logs: [],
    status: 1,
  },
  articulatedTx: {
    name: 'transfer',
    inputs: {
      _to: '0x308fedfb88f6e85f27b85c8011ccb9b5e15bcbf7',
      _value: '10000000000000000000',
    },
    outputs: {
      _success: '',
    },
  },
  compressedTx: 'transfer(0x308fedfb88f6e85f27b85c8011ccb9b5e15bcbf7 /*_to*/, 10000000000000000000 /*_value*/); ',
  gasCost: 6916798000000000,
  gasUsed: 52006,
  date: '2021-03-31 12:11:55 UTC',
  ether: 0.000000000000000000,
}) as unknown as Transaction;

test('store', () => {
  const tx = getTransaction();
  Store.appendTransactions('mainnet', '0xf503017d7baf7fbc0fff7492b751025c6a78179b', [tx]);

  const result = Store.getTransactionsFor('mainnet', '0xf503017d7baf7fbc0fff7492b751025c6a78179b');
  expect(result).toEqual([tx]);
});
