import {
  useCallback,
  useContext,
} from 'react';

import {
  CancelLoadTransactions, GetChartItems, GetEventsItems, GetFunctionsItems, GetGas, GetNameFor, GetNeighbors, GetPage, GetTransactionsTotal, LoadNames, LoadTransactions, SetActiveFilters,
} from '../datastore/messages';
import { DatastoreApi, DataStoreContext } from '../DatastoreContext';

export function useDatastore() {
  const worker = useContext(DataStoreContext);

  if (!worker) {
    throw new Error('Datastore worker has not been initialized');
  }

  return {
    // General
    clearPerAccountStores: useCallback(() => worker.clearPerAccountStores(), [worker]),
    loadNames: useCallback(
      (options: LoadNames) => worker.loadNames(options),
      [worker],
    ),
    getNameFor: useCallback(
      (options: GetNameFor) => worker.getNameFor(options),
      [worker],
    ),

    loadTransactions: useCallback(
      (
        options: LoadTransactions,
        callback: Parameters<DatastoreApi['loadTransactions']>[1],
        onDone?: Parameters<DatastoreApi['loadTransactions']>[2],
      ) => worker.loadTransactions(options, callback, onDone),
      [worker],
    ),
    cancelLoadTransactions: useCallback(
      (options: CancelLoadTransactions) => worker.cancelLoadTransactions(options),
      [worker],
    ),
    getTransactionsTotal: useCallback(
      (options: GetTransactionsTotal) => worker.getTransactionsTotal(options),
      [worker],
    ),
    getPage: useCallback(
      (options: GetPage) => worker.getPage(options),
      [worker],
    ),
    getChartItems: useCallback(
      (options: GetChartItems) => worker.getChartItems(options),
      [worker],
    ),
    getEventsItems: useCallback(
      (options: GetEventsItems) => worker.getEventsItems(options),
      [worker],
    ),
    getFunctionsItems: useCallback(
      (options: GetFunctionsItems) => worker.getFunctionsItems(options),
      [worker],
    ),
    getGas: useCallback(
      (options: GetGas) => worker.getGas(options),
      [worker],
    ),
    getNeighbors: useCallback(
      (options: GetNeighbors) => worker.getNeighbors(options),
      [worker],
    ),

    // Filters
    setActiveFilters: useCallback(
      (options: SetActiveFilters) => worker.setActiveFilters(options),
      [worker],
    ),
  };
}
