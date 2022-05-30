import { address as Address, Name, Transaction } from '@sdk';

import { TransactionFilters } from '@modules/filters/transaction';

const store = {
  transactions: new Map<Address, Transaction[]>([]),
  filteredTransactions: new Map<Address, Transaction[]>([]),
  activeFilters: new Map<Address, TransactionFilters>([]),
  names: new Map<Address, Name>([]),
};

// General

export const clearPerAccountStores = () => {
  ([
    'transactions',
    'filteredTransactions',
    'activeFilters',
  ] as Array<keyof typeof store>).forEach((key) => store[key].clear());
};

// Transactions

type AppendTransactions = (chain: string, address: Address, transactions: Transaction[]) => number;
export const appendTransactions: AppendTransactions = (chain, address, transactions) => {
  const storeId = `${chain}:${address}`;
  const transactionStore = store.transactions;
  const storeForAddress = transactionStore.get(storeId) || [];

  const updatedTransactions = storeForAddress.concat(transactions);
  transactionStore.set(storeId, updatedTransactions);

  return updatedTransactions.length;
};

type DeleteAll = () => void;
const makeDeleteAll = (storeKey: keyof typeof store) => () => store[storeKey].clear();
export const deleteAllTransactions: DeleteAll = makeDeleteAll('transactions');

type ReplaceTransactions = AppendTransactions;
export const replaceTransactions: ReplaceTransactions = (chain, address, transactions) => {
  deleteAllTransactions();
  return appendTransactions(chain, address, transactions);
};

type GetTransactionsFor = (chain: string, address: Address) => Transaction[] | undefined;
export const getTransactionsFor: GetTransactionsFor = (chain, address) => store.transactions.get(`${chain}:${address}`);

// Filtered Transactions

type AppendFilteredTransactions = AppendTransactions;
export const appendFilteredTransactions: AppendFilteredTransactions = (chain, address, transactions) => {
  const storeId = `${chain}:${address}`;
  const transactionStore = store.filteredTransactions;
  const storeForAddress = transactionStore.get(storeId) || [];

  const updatedTransactions = storeForAddress.concat(transactions);
  transactionStore.set(storeId, updatedTransactions);

  return updatedTransactions.length;
};

type ReplaceFilteredTransactions = ReplaceTransactions;
export const replaceFilteredTransactions: ReplaceFilteredTransactions = (chain, address, transactions) => {
  store.filteredTransactions.set(`${chain}:${address}`, transactions);

  return Number(store.filteredTransactions.get(`${chain}:${address}`)?.length);
};

export const deleteAllFilteredTransactions: DeleteAll = makeDeleteAll('filteredTransactions');

type GetFilteredTransactionsFor = GetTransactionsFor;
export const getFilteredTransactionsFor: GetFilteredTransactionsFor = (chain, address) => store.filteredTransactions.get(`${chain}:${address}`);

// Names

type GetNameFor = (address: Address) => Name | undefined;
export const getNameFor: GetNameFor = (address) => store.names.get(address);

type AppendName = (address: Address, name: Name) => number;
export const appendName: AppendName = (address, name) => {
  const { names } = store;
  names.set(address, name);
  return names.size;
};

export const deleteAllNames: DeleteAll = makeDeleteAll('names');

type ReplaceNames = (names: Name[]) => number;
export const replaceNames: ReplaceNames = (names) => {
  deleteAllNames();

  const namesMap = new Map(names.map((name) => [name.address, name]));
  store.names = namesMap;

  return namesMap.size;
};

// Filters

type SetActiveFilters = (chain: string, address: Address, filters: TransactionFilters) => void;
export const setActiveFilters: SetActiveFilters = (chain, address, filters) => {
  store.activeFilters.set(`${chain}:${address}`, filters);
};

type GetActiveFilters = (
  chain: string,
  address: Address,
) => TransactionFilters | undefined;
export const getActiveFilters: GetActiveFilters = (chain, address) => store.activeFilters.get(`${chain}:${address}`);
