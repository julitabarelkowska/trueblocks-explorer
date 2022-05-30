import { address, Transaction } from '@sdk';

export type FiltersState = FiltersOn | FiltersOff;
export type FiltersOn = {
  active: true,
} & TransactionFilters;

export type FiltersOff = {
  active: false,
};

export type TransactionFilters = {
  asset: address,
  event: string,
  function: string,
};

export function hasTransactionAsset({ statements }: Transaction, assetAddress: string) {
  if (!assetAddress) return false;

  return Boolean(
    statements
      ?.find?.(({ assetAddr }) => assetAddr === assetAddress),
  );
}

export function hasTransactionEvent({ receipt }: Transaction, eventName: string) {
  if (!eventName) return false;

  return Boolean(
    receipt?.logs
      ?.find?.(({ articulatedLog }) => articulatedLog?.name === eventName),
  );
}

export function hasTransactionFunction({ articulatedTx }: Transaction, functionName: string) {
  if (!functionName) return false;

  return articulatedTx?.name === functionName;
}

type ApplyTransactionFilters = (filters: TransactionFilters) => (transaction: Transaction) => Boolean;
export const applyTransactionFilters: ApplyTransactionFilters = (filters) => (transaction) => Object.entries(filters)
  .every(([filterName, value]) => {
    if (!value) return true;

    if (filterName === 'asset') return hasTransactionAsset(transaction, value);
    if (filterName === 'event') return hasTransactionEvent(transaction, value);
    if (filterName === 'function') return hasTransactionFunction(transaction, value);

    throw new Error(`Unknown filter: "${filterName}"`);
  });

export function areFiltersActive(state: FiltersState): state is FiltersOn {
  return state.active;
}
