import React, { useCallback } from 'react';
import {
  Route, useHistory,
} from 'react-router-dom';

import { Tabs } from 'antd';

export type RouteTabsProps = {
  tabs: {
    location: string | string[],
    name: string,
    disabled?: boolean,
    component: JSX.Element,
  }[],
}

export function RouteTabs({ tabs }: RouteTabsProps) {
  const history = useHistory();
  const getSingleLocation = (location: string | string[]) => (Array.isArray(location) ? location[0] : location);
  const onChange = useCallback((location: string) => {
    history.push(location);
  }, [history]);

  const findActive = useCallback(() => {
    const activeRoute = tabs.find(({ location }) => location.includes(history.location.pathname));
    if (!activeRoute) {
      return getSingleLocation(tabs[0].location);
    }
    return getSingleLocation(activeRoute.location);
  }, [history.location.pathname, tabs]);

  return (
    <Tabs onChange={onChange} activeKey={findActive()}>
      {tabs.map((tab) => (
        <Tabs.TabPane
          key={getSingleLocation(tab.location)}
          tab={tab.name}
          disabled={tab.disabled}
        >
          <Route path={tab.location} render={() => tab.component} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}
