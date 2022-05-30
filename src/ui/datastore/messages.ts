import {
  address, getNames, ListStats, Name,
} from '@sdk';

import { TransactionFilters } from '@modules/filters/transaction';

import {
  getChartItems, GetChartItemsOptions, getEventsItems, getFunctionsItems, getGas, getNeighbors, getPage,
} from './worker/transactions';

export type DataStoreMessage =
  | LoadTransactions
  | CancelLoadTransactions
  | GetTransactionsTotal
  | GetPage
  | GetChartItems
  | GetEventsItems
  | GetFunctionsItems
  | GetGas
  | GetNeighbors
  | LoadNames
  | GetNameFor;

export type LoadTransactions = {
  chain: string,
  address: address,
};

export type LoadTransactionsStatus = {
  new: number,
  total: number
}

export type CancelLoadTransactions = {
  chain: string,
  address: address,
};

export type GetTransactionsTotal = {
  chain: string,
  addresses: address[],
}

export type GetTransactionsTotalResult = ListStats[];

export type GetPage = {
  chain: string,
  address: address,
  page: number,
  pageSize: number,
  filtered?: boolean
};

export type GetPageResult = ReturnType<typeof getPage>;

export type GetChartItems = {
  chain: string,
  address: address,
} & GetChartItemsOptions;

export type GetChartItemsResult = ReturnType<typeof getChartItems>;

export type GetEventsItems = {
  chain: string,
  address: address,
};

export type GetEventsItemsResult = ReturnType<typeof getEventsItems>;

export type GetFunctionsItems = {
  chain: string,
  address: address,
};

export type GetFunctionsItemsResult = ReturnType<typeof getFunctionsItems>;

export type GetGas = {
  chain: string,
  address: address,
};

export type GetGasResult = ReturnType<typeof getGas>;

export type GetNeighbors = {
  chain: string,
  address: address,
};

export type GetNeighborsResult = ReturnType<typeof getNeighbors>;

export type LoadNames = Parameters<typeof getNames>[0];

export type LoadNamesResult = { total: number };

export type GetNameFor = {
  address: address,
};

export type GetNameForResult = Name | undefined;

// Filters

export type SetActiveFilters = {
  chain: string,
  address: address,
  filters: TransactionFilters,
};

export type GetActiveFilters = {
  chain: string,
  address: address,
};
