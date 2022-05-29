import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { wrap } from 'comlink';

import { App } from './App';
import { DataStoreContext } from './DatastoreContext';
import { GlobalStateProvider, useGlobalState2 } from './State';
import { setupWebsocket } from './websockets';

const { host, port } = useGlobalState2();
setupWebsocket(host, port, 'websocket');

// We have to ignore TS complaining about having URL instead of string. This line of code
// has always look this way, because Webpack is doing static code analysis to find out
// workers
// @ts-ignore
const worker = new SharedWorker(new URL('./datastore/worker', import.meta.url), { type: 'module' });
const wrapped = wrap<typeof import('./datastore/worker').api>(worker.port);

render(
  <DataStoreContext.Provider value={wrapped}>
    <GlobalStateProvider>
      <Router>
        <App />
      </Router>
    </GlobalStateProvider>
  </DataStoreContext.Provider>,
  document.getElementById('root'),
);
