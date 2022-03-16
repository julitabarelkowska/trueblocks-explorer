import {
  address, getNames, ListStats, Transaction,
} from '@sdk';

import { getChartItems } from './worker/transactions';

export type DataStoreMessage =
  | LoadTransactions
  | CancelLoadTransactions
  | GetTransactionsTotal
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

export type LoadTransactionsStatus = {
  new: number,
  total: number
}

export type CancelLoadTransactions = {
  call: 'cancelLoadTransactions',
  args: {
    address: address,
  },
};

export type GetTransactionsTotal = {
  call: 'getTransactionsTotal',
  args: {
    chain: string,
    addresses: address[],
  }
}

export type GetTransactionsTotalResult = ListStats[];

export type GetPage = {
  call: 'getPage',
  args: {
    address: address,
    page: number,
    pageSize: number,
  },
};

export type GetPageResult = Transaction[];

export type GetChartItems = {
  call: 'getChartItems',
  args: {
    address: address,
    // TODO: below is copy-pase, import type here
    denom: 'ether' | 'dollars',
    zeroBalanceStrategy: 'ignore-non-zero' | 'ignore-zero' | 'unset',
  }
};

export type GetChartItemsResult = ReturnType<typeof getChartItems>;

export type LoadNames = {
  call: 'loadNames',
  args: Parameters<typeof getNames>[0],
}

export type LoadNamesResult = { total: number };
