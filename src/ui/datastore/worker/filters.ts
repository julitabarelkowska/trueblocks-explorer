// TODO: move to transactions/filters

import { Transaction } from '@sdk';

import {
  hasTransactionAsset, hasTransactionEvent, hasTransactionFunction, TransactionFilters,
} from '@modules/filters/transaction';

type ApplyTransactionFilters = (filters: TransactionFilters) => (transaction: Transaction) => Boolean;
export const applyTransactionFilters: ApplyTransactionFilters = (filters) => (transaction) => Object.entries(filters)
  .every(([filterName, value]) => {
    if (!value) return true;

    if (filterName === 'asset') return hasTransactionAsset(transaction, value);
    if (filterName === 'event') return hasTransactionEvent(transaction, value);
    if (filterName === 'function') return hasTransactionFunction(transaction, value);

    throw new Error(`Unknown filter: "${filterName}"`);
  });
