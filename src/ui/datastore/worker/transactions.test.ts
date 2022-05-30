import { Transaction } from '@sdk';

import * as Transactions from './transactions';

describe('datastore/transactions', () => {
  it('returns chart items', () => {
    const transactionDate = new Date(2022, 0, 10, 11);

    const transactions = [
      {
        statements: [
          {
            timestamp: transactionDate.getTime() / 1000, spotPrice: 2, assetAddr: '0xdeadbeef', assetSymbol: 'BEEF', endBal: 1,
          },
        ],
      },
    ] as unknown as Transaction[];

    const result = Transactions.getChartItems(transactions, { denom: 'ether', zeroBalanceStrategy: 'unset' });
    expect(result).toEqual([
      {
        assetAddr: '0xdeadbeef',
        assetSymbol: 'BEEF',
        items: [
          {
            date: '2022-01-10',
            '0xdeadbeef': 1,
          },
        ],
      },
    ]);
  });
});
