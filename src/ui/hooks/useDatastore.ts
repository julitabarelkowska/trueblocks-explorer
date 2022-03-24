import {
  useCallback, useContext,
} from 'react';

import {
  CancelLoadTransactions,
  DataStoreMessage,
  DataStoreResult,
  GetChartItems,
  GetEventsItems,
  GetFunctionsItems,
  GetGas,
  GetNeighbors,
  GetPage,
  GetTransactionsTotal,
  LoadNames,
  LoadTransactions,
} from '../datastore/messages';
import { DataStoreContext } from '../DatastoreContext';

export function useDatastore() {
  const context = useContext(DataStoreContext);

  if (!context) {
    throw new Error('useDatastore must be used within DatastoreContext.Provider');
  }

  if (!context.datastore) {
    throw new Error('Datastore worker has not been initialized');
  }

  // TODO: listen to `error` event

  const sendMessage = useCallback((message: DataStoreMessage) => {
    if (!context.datastore) {
      throw new Error('Datastore worker has not been initialized');
    }

    console.log('[ App ] sending', message);
    context.datastore.port.postMessage(message);
  }, [context.datastore]);

  // TODO: move error listeners?
  context.datastore.port.addEventListener('messageerror', (e) => {
    throw new Error(e.data);
  });

  // TODO: temporary
  // context.datastore.port.addEventListener('message', (e) => {
  //   console.log('[ App ] got message', e.data);
  // });

  context.datastore.addEventListener('error', (e) => { throw new Error(e.error); });

  const addListener = useCallback((listener: (event: MessageEvent) => void) => {
    context.datastore?.port.addEventListener('message', listener);
    return () => context.datastore?.port.removeEventListener('message', listener);
  }, [context.datastore?.port]);

  type OnMessages = <ResultType>(callback: (message: DataStoreResult<ResultType>) => void) => void
  const onMessages: OnMessages = useCallback((callback) => addListener((event) => callback(event.data)), [addListener]);

  type OnMessage = <ResultType>(
    call: DataStoreMessage['call'],
    callback: (message: DataStoreResult<ResultType>) => void
  ) => void
  const onMessage: OnMessage = useCallback((call, callback) => addListener((event) => {
    if (event.data.call !== call) return;
    callback(event.data);
  }), [addListener]);

  return {
    onMessages,
    onMessage,

    loadTransactions: useCallback((args: LoadTransactions['args']) => sendMessage({
      call: 'loadTransactions',
      args,
    }), [sendMessage]),
    cancelLoadTransactions: useCallback((args: CancelLoadTransactions['args']) => sendMessage({
      call: 'cancelLoadTransactions',
      args,
    }), [sendMessage]),
    getTransactionsTotal: useCallback((args: GetTransactionsTotal['args']) => sendMessage({
      call: 'getTransactionsTotal',
      args,
    }), [sendMessage]),
    getPage: useCallback((args: GetPage['args']) => sendMessage({
      call: 'getPage',
      args,
    }), [sendMessage]),
    getChartItems: useCallback((args: GetChartItems['args']) => sendMessage({
      call: 'getChartItems',
      args,
    }), [sendMessage]),
    getEventsItems: useCallback((args: GetEventsItems['args']) => sendMessage({
      call: 'getEventsItems',
      args,
    }), [sendMessage]),
    getFunctionsItems: useCallback((args: GetFunctionsItems['args']) => sendMessage({
      call: 'getFunctionsItems',
      args,
    }), [sendMessage]),
    getGas: useCallback((args: GetGas['args']) => sendMessage({
      call: 'getGas',
      args,
    }), [sendMessage]),
    getNeighbors: useCallback((args: GetNeighbors['args']) => sendMessage({
      call: 'getNeighbors',
      args,
    }), [sendMessage]),

    loadNames: useCallback((args: LoadNames['args']) => sendMessage({
      call: 'loadNames',
      args,
    }), [sendMessage]),
  };
}
