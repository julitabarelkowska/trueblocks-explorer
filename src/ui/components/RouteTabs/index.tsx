import React, { useCallback } from 'react';
import {
  Route, useHistory,
} from 'react-router-dom';

import { Tabs, TabsProps } from 'antd';

import { useSearchParams } from '@hooks/useSearchParams';

export type RouteTabsProps = {
  tabs: {
    location: string | string[],
    name: string,
    disabled?: boolean,
    component: JSX.Element,
  }[],
  tabPosition?: TabsProps['tabPosition'],
}

export function RouteTabs({ tabs, tabPosition }: RouteTabsProps) {
  const history = useHistory();
  const search = useSearchParams();
  const getSingleLocation = useCallback((location: string | string[]) => (Array.isArray(location) ? location[0] : location), []);
  const onChange = useCallback((location: string) => {
    history.push({
      pathname: location,
      search: search.toString(),
    });
  }, [history, search]);

  const findActive = useCallback(() => {
    const activeRoute = tabs.find(({ location }) => location.includes(history.location.pathname));

    if (!activeRoute) {
      return getSingleLocation(tabs[0].location);
    }

    return getSingleLocation(activeRoute.location);
  }, [getSingleLocation, history.location.pathname, tabs]);

  return (
    <Tabs
      onChange={onChange}
      activeKey={findActive()}
      tabPosition={tabPosition}
    >
      {tabs.map((tab) => (
        <Tabs.TabPane
          key={getSingleLocation(tab.location)}
          tab={tab.name}
          disabled={tab.disabled}
        >
          <Route path={tab.location} render={() => tab.component} exact />
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}
