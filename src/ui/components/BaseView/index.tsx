import React from 'react';

import { PageHeader } from 'antd';

import { RouteTabs } from '@components/RouteTabs';

export type ViewTab = {
  name: string;
  location: string | string[];
  component: JSX.Element;
  disabled?: boolean;
};

declare type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export interface ViewParams {
  tabs: ViewTab[];
  cookieName: string;
  title?: string;
  position?: TabsPosition;
}

export const BaseView = ({
  tabs, title = '',
}: ViewParams) => {
  const titleComponent = title.length === 0 ? <></> : <PageHeader style={{ padding: '0px' }} title={title} />;
  return (
    <>
      {titleComponent}
      <RouteTabs
        tabs={tabs}
      />
    </>
  );
};
