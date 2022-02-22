import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './App';
import { GlobalStateProvider, useGlobalState2 } from './State';
import { setupWebsocket } from './websockets';

const { host, port } = useGlobalState2();
setupWebsocket(host, port, 'websocket');

render(
  <GlobalStateProvider>
    <Router>
      <App />
    </Router>
  </GlobalStateProvider>,
  document.getElementById('root'),
);
