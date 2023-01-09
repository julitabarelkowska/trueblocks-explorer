import React, { useMemo } from 'react';
import {
  Route, Switch, useLocation,
} from 'react-router-dom';

import { Loading } from '@components/Loading';

import { helpRoutes } from '../../HelpRoutes';

export const HelpPanel = () => {
  const location = useLocation();
  const matchedRoute = useMemo(
    () => helpRoutes.find((item: any) => location.pathname.endsWith(item.path)),
    [location.pathname],
  );

  const url = useMemo(
    () => {
      const ret = 'https://trueblocks.io/explorer/';
      if (!matchedRoute) { return ret; }
      const parts = `${matchedRoute.path}`.split('/');
      const tag = parts.pop();
      let rr = String(new URL(`${parts.join('/')}#${tag}`, ret));
      rr = rr.replace('https://trueblocks.io/explorer/#', 'https://trueblocks.io/');
      rr = rr.replace('https://trueblocks.io/', 'https://trueblocks.io/explorer/');
      return (
        rr
      );
    },
    [matchedRoute],
  );

  return (
    <Loading loading={false}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          alignItems: 'center',
          letterSpacing: '0.1em',
        }}
      >
        <div>
          <Switch>
            {helpRoutes.map((route) => (
            // eslint-disable-next-line
                <Route {...route} key={Array.isArray(route.path) ? route.path[0] : route.path} />
            ))}
          </Switch>
          <div>
            <a href={url} target='_blank' rel='noreferrer'>
              Learn more...
            </a>
          </div>
        </div>
      </div>
    </Loading>
  );
};
