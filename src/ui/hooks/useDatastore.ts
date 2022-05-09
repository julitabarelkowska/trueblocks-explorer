import {
  useCallback,
  useContext,
} from 'react';

import {
  CancelLoadTransactions, GetChartItems, GetEventsItems, GetFunctionsItems, GetGas, GetNameFor, GetNeighbors, GetPage, GetSlice, GetTransactionsTotal, LoadNames, LoadTransactions,
} from '../datastore/messages';
import { DatastoreApi, DataStoreContext } from '../DatastoreContext';

export function useDatastore() {
  const worker = useContext(DataStoreContext);

  if (!worker) {
    throw new Error('Datastore worker has not been initialized');
  }

  return {
    loadNames: useCallback(
      (options: LoadNames['args']) => worker.loadNames(options),
      [worker],
    ),
    getNameFor: useCallback(
      (options: GetNameFor['args']) => worker.getNameFor(options),
      [worker],
    ),

    loadTransactions: useCallback(
      (options: LoadTransactions['args'], callback: Parameters<DatastoreApi['loadTransactions']>[1]) => worker.loadTransactions(options, callback),
      [worker],
    ),
    cancelLoadTransactions: useCallback(
      (options: CancelLoadTransactions['args']) => worker.cancelLoadTransactions(options),
      [worker],
    ),
    getTransactionsTotal: useCallback(
      (options: GetTransactionsTotal['args']) => worker.getTransactionsTotal(options),
      [worker],
    ),
    getPage: useCallback(
      (options: GetPage['args']) => worker.getPage(options),
      [worker],
    ),
    getSlice: useCallback(
      (options: GetSlice['args']) => worker.getSlice(options),
      [worker],
    ),
    getChartItems: useCallback(
      (options: GetChartItems['args']) => worker.getChartItems(options),
      [worker],
    ),
    getEventsItems: useCallback(
      (options: GetEventsItems['args']) => worker.getEventsItems(options),
      [worker],
    ),
    getFunctionsItems: useCallback(
      (options: GetFunctionsItems['args']) => worker.getFunctionsItems(options),
      [worker],
    ),
    getGas: useCallback(
      (options: GetGas['args']) => worker.getGas(options),
      [worker],
    ),
    getNeighbors: useCallback(
      (options: GetNeighbors['args']) => worker.getNeighbors(options),
      [worker],
    ),
  };
}
