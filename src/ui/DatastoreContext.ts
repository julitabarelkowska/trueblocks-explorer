import { createContext } from 'react';

export const DataStoreContext = createContext<{
  datastore?: SharedWorker
}>({ datastore: undefined });
