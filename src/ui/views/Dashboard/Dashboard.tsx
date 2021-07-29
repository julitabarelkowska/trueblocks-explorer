import {
  DashboardAccountsLocation,
  DashboardCollectionsLocation,
  DashboardLocation,
  DashboardMonitorsLocation,
} from '../../Routes';
import useGlobalState, { useGlobalNames } from '../../State';
import { cookieVars } from '../../Utilities';
import { AccountsView } from './Tabs/Accounts/Accounts';
import { Collections } from './Tabs/Collections';
import { Monitors } from './Tabs/Monitors';
import { BaseView } from '@components/BaseView';
import { emptyData, Result, toFailedResult, toSuccessfulData } from '@hooks/useCommand';
import { runCommand } from '@modules/core';
import { createErrorNotification } from '@modules/error_notification';
import { either as Either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import React, { useEffect, useState } from 'react';

export const DashboardView = ({ match }: { match?: any }) => {
  const { accountAddress, setAccountAddress, transactions, setTransactions, totalRecords, setTotalRecords } =
    useGlobalState();
  const { names } = useGlobalNames();
  const [named, setNamed] = useState('');
  const [denom, setDenom] = useState('ether');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const name = names && names[accountAddress];
    if (name) setNamed(name.name);
  }, [accountAddress, names]);

  useEffect(() => {
    (async () => {
      if (accountAddress?.slice(0, 2) === '0x') {
        setLoading(true);
        const eitherResponse = await runCommand('list', {
          count: true,
          appearances: true,
          addrs: accountAddress,
        });
        const result: Result = pipe(
          eitherResponse,
          Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
        );
        //@ts-ignore
        setTotalRecords(result.data[0]?.nRecords);
        setLoading(false);
      }
    })();
  }, [accountAddress]); //, denom, staging]);

  useEffect(() => {
    (async () => {
      if (totalRecords && (transactions?.data.length || 0) < totalRecords) {
        const eitherResponse = await runCommand('export', {
          addrs: accountAddress,
          fmt: 'json',
          cache_txs: true,
          cache_traces: true,
          staging: false, //staging,
          // unripe: true,
          ether: true,
          //denom === 'ether',
          dollars: false,
          //denom === 'dollars',
          articulate: true,
          accounting: true,
          reversed: false,
          relevant: true,
          first_record: transactions?.data?.length || 0,
          // 10,
          max_records:
            (transactions?.data?.length || 0) < 50
              ? 10
              : (transactions?.data?.length || 0) < 150
              ? 71
              : (transactions?.data?.length || 0) < 1500
              ? 239
              : 639 /* an arbitrary number not too big, not too small, that appears not to repeat */,
        });
        const result: Result = pipe(
          eitherResponse,
          Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
        );
        let newTransactions: Result = transactions?.data ? { ...transactions } : toSuccessfulData(emptyData);
        //@ts-ignore
        newTransactions.data =
          newTransactions.data.length === 1 ? [...result.data] : [...newTransactions.data, ...result.data];
        setTransactions(newTransactions);
      }
    })();
  }, [totalRecords, transactions]); //, denom, staging]);

  if (transactions?.status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch transactions',
    });
  }

  const title = `Dashboard [${accountAddress ? accountAddress : ''} ${accountAddress ? named : ''}]`;
  const tabs = [
    { name: 'Monitors', location: DashboardMonitorsLocation, component: <Monitors />, disabled: false },
    {
      name: 'Account Details',
      location: DashboardAccountsLocation,
      component: (
        <AccountsView
          loading={loading}
          setLoading={setLoading}
          accountAddress={accountAddress}
          setAccountAddress={setAccountAddress}
          totalRecords={totalRecords}
          transactions={transactions}
          setTransactions={setTransactions}
          denom={denom}
          setDenom={setDenom}
        />
      ),
      disabled: false,
    },
    { name: 'Collections', location: DashboardCollectionsLocation, component: <Collections />, disabled: false },
  ];

  return (
    <BaseView
      title={title}
      defaultActive={DashboardMonitorsLocation}
      baseActive={DashboardLocation}
      cookieName={cookieVars.dashboard_current_tab}
      tabs={tabs}
    />
  );
};
