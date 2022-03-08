import { address, getNames, Transaction } from '@sdk';

export type DataStoreMessage =
  | LoadTransactions
  | GetPage
  | GetChartItems
  | LoadNames;

// TODO move it or change file name
export type DataStoreResult<ResultType> = {
  call: DataStoreMessage['call'],
  result: ResultType,
};

export type LoadTransactions = {
  call: 'loadTransactions',
  args: {
    address: address,
  }
};

export type GetPage = {
  call: 'getPage',
  args: {
    address: address,
    page: number,
    pageSize: number,
  },
};

export type GetChartItems = {
  call: 'getChartItems',
  args: {
    address: address,
    // TODO: below is copy-pase, import type here
    denom: 'ether' | 'dollars',
    zeroBalanceStrategy: 'ignore-non-zero' | 'ignore-zero' | 'unset',
  }
};

export type LoadTransactionsResult = DataStoreResult<{ new: number, total: number }>;
export type GetPageResult = DataStoreResult<Transaction[]>;

export type LoadNames = {
  call: 'loadNames',
  args: Parameters<typeof getNames>[0],
}

export type LoadNamesResult = DataStoreResult<{ total: number }>;
