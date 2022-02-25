import React, { useCallback, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { generatePath } from 'react-router-dom';

import { useGlobalState } from '@state';
import { Divider } from 'antd';

import { BaseView, ViewTab } from '@components/BaseView';

import {
  DashboardAccountsAddressLocation,
  // DashboardAccountsChartsLocation,
  DashboardAccountsEventsLocation,
  DashboardAccountsFunctionsLocation,
  DashboardAccountsGasLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsNeighborsLocation,
} from '../../../../Routes';
import { AccountViewParams } from '../../Dashboard';
import { AddressBar } from './components/AddressBar';
import { ViewOptions } from './components/ViewOptions';
import {
  Charts, Events, Functions, Gas, History, Neighbors,
} from './SubTabs';

export const DetailsView = ({ params }: { params: AccountViewParams }) => {
  const { currentAddress } = useGlobalState();
  const {
    theData, loading,
  } = params;

  const generatePathWithAddress = useCallback((pathname: string) => generatePath(pathname, {
    address: currentAddress,
  }), [currentAddress]);

  const leftSideTabs: ViewTab[] = useMemo(() => [
    {
      name: 'Charts',
      location: generatePathWithAddress(DashboardAccountsAddressLocation),
      component: <Charts params={params} />,
    },
    {
      name: 'History',
      location: generatePathWithAddress(DashboardAccountsHistoryLocation),
      component: <History params={params} />,
    },
    {
      name: 'Events',
      location: generatePathWithAddress(DashboardAccountsEventsLocation),
      component: <Events theData={theData} />,
    },
    {
      name: 'Functions',
      location: generatePathWithAddress(DashboardAccountsFunctionsLocation),
      component: <Functions theData={theData} loading={loading} />,
    },
    {
      name: 'Gas',
      location: generatePathWithAddress(DashboardAccountsGasLocation),
      component: <Gas theData={theData} />,
    },
    {
      name: 'Neighbors',
      location: generatePathWithAddress(DashboardAccountsNeighborsLocation),
      component: <Neighbors theData={theData} />,
    },
  ],
  [generatePathWithAddress, loading, params, theData]);

  if (!theData) return <></>;

  return (
    <div>
      <AddressBar params={params} />
      <Divider style={{ height: '1px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '20fr 1fr' }}>
        <BaseView cookieName='COOKIE_DASHBOARD_ACCOUNTS' tabs={leftSideTabs} position='left' />
        <ViewOptions params={params} />
      </div>
    </div>
  );
};

export const useAcctStyles = createUseStyles({
  container: {
  },
  cardHolder: {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: '2px',
    padding: '1px',
  },
  card: {
    width: '100%',
    border: '2px solid darkgrey',
    marginBottom: '4px',
  },
  pre: {
    width: '100%',
    lineBreak: 'anywhere',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  tableHead: {
    padding: '0px',
    margin: '0px',
    overflowX: 'hidden',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: '+1',
    borderBottom: '1px solid lightgrey',
  },
  tableRow: {
    padding: '0px',
    margin: '0px',
    overflowX: 'hidden',
    textAlign: 'right',
  },
});

export const headerStyle = {
  backgroundColor: 'lightgrey',
  fontSize: '16pt',
  color: 'darkBlue',
};
