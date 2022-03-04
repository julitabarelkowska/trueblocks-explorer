import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

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
worker.port.start();

render(
  <DataStoreContext.Provider value={{ datastore: worker }}>
    <GlobalStateProvider>
      <Router>
        <App />
      </Router>
    </GlobalStateProvider>
  </DataStoreContext.Provider>,
  document.getElementById('root'),
);
