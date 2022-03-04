import { address, Transaction } from '@sdk';

export type DataStoreMessage =
  | LoadTransactions
  | GetPage;

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

export type LoadTransactionsResult = DataStoreResult<{ length: number }>;
export type GetPageResult = DataStoreResult<Transaction[]>;
