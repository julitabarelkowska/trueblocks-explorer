import {
  DashboardAccountsHistoryCustomLocation,
  DashboardAccountsHistoryEventsLocation,
  DashboardAccountsHistoryFunctionsLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsHistoryReconsLocation,
  DashboardAccountsHistoryTracesLocation,
} from '../../../../../Routes';
import useGlobalState from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';
import { transactionSchema } from '../Accounts';
import { HistoryEvents } from './HistoryEvents';
import { HistoryFunctions } from './HistoryFunctions';
import { HistoryRecons } from './HistoryRecons';
import { BaseView } from '@components/BaseView';
import { BaseTable } from '@components/Table';
import React from 'react';

export const History = ({ params }: { params: AccountViewParams }) => {
  const { theData, loading } = params;
  const { accountAddress } = useGlobalState();
  const siderRender = (record: any) => (
    <AccountHistorySider key='account-transactions' record={record} params={params} />
  );
  return (
    <BaseTable
      dataSource={theData}
      columns={transactionSchema}
      loading={loading}
      extraData={accountAddress}
      siderRender={siderRender}
    />
  );
};

export const AccountHistorySider = ({ record, params }: { record: any; params: AccountViewParams }) => {
  const tabs = [
    {
      name: 'Recons',
      location: DashboardAccountsHistoryReconsLocation,
      component: <HistoryRecons record={record} params={params} />,
    },
    {
      name: 'Events',
      location: DashboardAccountsHistoryEventsLocation,
      component: <HistoryEvents record={record} />,
    },
    {
      name: 'Function',
      location: DashboardAccountsHistoryFunctionsLocation,
      component: <HistoryFunctions record={record} />,
    },
    {
      name: 'Traces',
      location: DashboardAccountsHistoryTracesLocation,
      component: <pre>{JSON.stringify(record?.traces, null, 2)}</pre>,
    },
    {
      name: 'Custom',
      location: DashboardAccountsHistoryCustomLocation,
      component: <pre>{JSON.stringify(record?.to, null, 2)}</pre>,
    },
  ];

  return (
    <BaseView
      defaultActive={DashboardAccountsHistoryReconsLocation}
      baseActive={DashboardAccountsHistoryLocation}
      cookieName={'COOKIE_DASHBOARD_ACCOUNT_HISTORY_SUB_TAB'}
      tabs={tabs}
      subBase={true}
    />
  );
};
