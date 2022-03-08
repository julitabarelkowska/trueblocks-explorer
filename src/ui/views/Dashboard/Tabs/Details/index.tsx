import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';

import { BaseView, ViewTab } from '@components/BaseView';
import { usePathWithAddress } from '@hooks/paths';

import {
  DashboardAccountsAddressLocation,
  DashboardAccountsHistoryCustomLocation,
  DashboardAccountsHistoryEventsLocation,
  DashboardAccountsHistoryFunctionsLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsHistoryReconsLocation,
} from '../../../../Routes';
import { AccountViewParams } from '../../Dashboard';
import { AddressBar } from './components/AddressBar';
import { ViewOptions } from './components/ViewOptions';
import {
  Charts,
  History,
} from './SubTabs';

export const DetailsView = ({ params }: { params: Omit<AccountViewParams, 'theData'> }) => {
  const {
    loading,
  } = params;

  const generatePathWithAddress = usePathWithAddress();
  const historyPaths = [
    DashboardAccountsHistoryLocation,
    DashboardAccountsHistoryReconsLocation,
    DashboardAccountsHistoryFunctionsLocation,
    DashboardAccountsHistoryEventsLocation,
    DashboardAccountsHistoryCustomLocation,
  ];

  const leftSideTabs: ViewTab[] = useMemo(() => [
    // TODO: this uses another data layout: txs per asset, so we should return it from datastore.
    {
      name: 'Charts',
      location: generatePathWithAddress(DashboardAccountsAddressLocation),
      component: <Charts params={params} />,
    },
    {
      name: 'History',
      location: historyPaths.map((path) => generatePathWithAddress(path)),
      component: <History params={params} />,
    },
    // TODO: following tabs are similar: they use aggregated data
    // {
    //   name: 'Events',
    //   location: generatePathWithAddress(DashboardAccountsEventsLocation),
    //   component: <Events theData={theData} />,
    // },
    // {
    //   name: 'Functions',
    //   location: generatePathWithAddress(DashboardAccountsFunctionsLocation),
    //   component: <Functions theData={theData} loading={loading} />,
    // },
    // {
    //   name: 'Gas',
    //   location: generatePathWithAddress(DashboardAccountsGasLocation),
    //   component: <Gas theData={theData} />,
    // },
    // {
    //   name: 'Neighbors',
    //   location: generatePathWithAddress(DashboardAccountsNeighborsLocation),
    //   component: <Neighbors theData={theData} />,
    // },
  ],
  [generatePathWithAddress, loading, params]);

  // if (!theData) return <></>;

  return (
    <div>
      <AddressBar params={{ ...params, theData: [] }} />
      <div>
        <ViewOptions params={{ ...params, theData: [] }} />
        <BaseView cookieName='COOKIE_DASHBOARD_ACCOUNTS' tabs={leftSideTabs} position='left' />
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
