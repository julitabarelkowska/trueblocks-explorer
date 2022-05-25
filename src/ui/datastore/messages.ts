import {
  address, getNames, ListStats, Name,
} from '@sdk';

import { TransactionFilters } from '@modules/filters/transaction';

import {
  getChartItems, GetChartItemsOptions, getEventsItems, getFunctionsItems, getGas, getNeighbors, getPage, getSlice,
} from './worker/transactions';

export type DataStoreMessage =
  | LoadTransactions
  | CancelLoadTransactions
  | GetTransactionsTotal
  | GetPage
  | GetSlice
  | GetChartItems
  | GetEventsItems
  | GetFunctionsItems
  | GetGas
  | GetNeighbors
  | LoadNames
  | GetNameFor;

// TODO move it or change file name
export type DataStoreResult<ResultType> = {
  call: DataStoreMessage['call'],
  result: ResultType,
};

export type LoadTransactions = {
  call: 'loadTransactions',
  args: {
    chain: string,
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
    filtered?: boolean,
  }
}

export type GetTransactionsTotalResult = ListStats[];

export type GetPage = {
  call: 'getPage',
  args: {
    address: address,
    page: number,
    pageSize: number,
    filtered?: boolean
  },
};

export type GetPageResult = ReturnType<typeof getPage>;

export type GetSlice = {
  call: 'getSlice',
  args: {
    address: address,
    start: number,
    end: number,
  },
};

export type GetSliceResult = ReturnType<typeof getSlice>;

export type GetChartItems = {
  call: 'getChartItems',
  args: {
    address: address,
  } & GetChartItemsOptions,
};

export type GetChartItemsResult = ReturnType<typeof getChartItems>;

export type GetEventsItems = {
  call: 'getEventsItems',
  args: {
    address: address,
  },
};

export type GetEventsItemsResult = ReturnType<typeof getEventsItems>;

export type GetFunctionsItems = {
  call: 'getFunctionsItems',
  args: {
    address: address,
  },
};

export type GetFunctionsItemsResult = ReturnType<typeof getFunctionsItems>;

export type GetGas = {
  call: 'getGas',
  args: {
    address: address,
  },
};

export type GetGasResult = ReturnType<typeof getGas>;

export type GetNeighbors = {
  call: 'getNeighbors',
  args: {
    address: address,
  },
};

export type GetNeighborsResult = ReturnType<typeof getNeighbors>;

export type LoadNames = {
  call: 'loadNames',
  args: Parameters<typeof getNames>[0],
};

export type LoadNamesResult = { total: number };

export type GetNameFor = {
  call: 'getNameFor',
  args: {
    address: address,
  },
};

export type GetNameForResult = Name | undefined;

// Filters

export type SetActiveFilters = {
  args: {
    address: address,
    filters: TransactionFilters,
  },
};

export type GetActiveFilters = {
  args: {
    address: address,
  },
};
