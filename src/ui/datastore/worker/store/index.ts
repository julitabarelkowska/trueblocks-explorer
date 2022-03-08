import { address as Address, Name, Transaction } from '@sdk';

const store = {
  transactions: new Map<Address, Transaction[]>([]),
  names: new Map<Address, Name>([]),
};

type AppendTransactions = (address: Address, transactions: Transaction[]) => number;
export const appendTransactions: AppendTransactions = (address, transactions) => {
  const transactionStore = store.transactions;
  const storeForAddress = transactionStore.get(address) || [];

  const updatedTransactions = storeForAddress.concat(transactions);
  transactionStore.set(address, updatedTransactions);

  return updatedTransactions.length;
};

type DeleteAll = () => void;
const makeDeleteAll = (storeKey: keyof typeof store) => () => store[storeKey].clear();
export const deleteAllTransactions: DeleteAll = makeDeleteAll('transactions');
export const deleteAllNames: DeleteAll = makeDeleteAll('names');

type ReplaceTransactions = AppendTransactions;
export const replaceTransactions: ReplaceTransactions = (address, transactions) => {
  deleteAllTransactions();
  return appendTransactions(address, transactions);
};

type GetTransactionsFor = (address: Address) => Transaction[] | undefined;
export const getTransactionsFor: GetTransactionsFor = (address) => store.transactions.get(address);

type GetNameFor = (address: Address) => Name | undefined;
export const getNameFor: GetNameFor = (address) => store.names.get(address);

type AppendName = (address: Address, name: Name) => number;
export const appendName: AppendName = (address, name) => {
  const { names } = store;
  names.set(address, name);
  return names.size;
};

type ReplaceNames = (names: Name[]) => number;
export const replaceNames: ReplaceNames = (names) => {
  deleteAllNames();

  const namesMap = new Map(names.map((name) => [name.address, name]));
  store.names = namesMap;

  return namesMap.size;
};
