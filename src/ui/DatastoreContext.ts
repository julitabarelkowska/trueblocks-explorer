import { createContext } from 'react';

import { Remote } from 'comlink';

export type DatastoreApi = typeof import('./datastore/worker').api;
type Wrapped = Remote<DatastoreApi>;

export const DataStoreContext = createContext<Wrapped | undefined>(undefined);
