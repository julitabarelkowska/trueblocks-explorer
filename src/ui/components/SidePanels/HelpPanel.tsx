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
    () => String(matchedRoute && new URL(`docs/explorer${matchedRoute.path}`, 'https://docs.trueblocks.io/')),
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
                <Route {...route} key={route.path} />
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
