import { address as Address, Transaction } from '@sdk';

export type Store = Map<Address, Transaction[]>;

const store: Store = new Map([]);

export const getDirect = () => store;

type Append = (address: Address, transactions: Transaction[]) => number;
export const append: Append = (address, transactions) => {
  const storeForAddress = store.get(address) || [];

  const updatedTransactions = storeForAddress.concat(transactions);
  store.set(address, updatedTransactions);

  return updatedTransactions.length;
};

type DeleteAll = () => void;
export const deleteAll: DeleteAll = () => store.clear();

type Replace = Append;
export const replace: Replace = (address, transactions) => {
  deleteAll();
  return append(address, transactions);
};

type GetBy = (address: Address) => Transaction[] | undefined;
export const getBy: GetBy = (address) => store.get(address);
