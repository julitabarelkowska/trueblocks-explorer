import React, {
  useEffect, useMemo, useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import {
  getExport, getList, ListStats, Transaction,
} from '@sdk';
import Mousetrap from 'mousetrap';

import { BaseView } from '@components/BaseView';
import { useSdk } from '@hooks/useSdk';
import { CallStatus, isFailedCall, isSuccessfulCall } from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';
import {
  // This type seems like a part of UI (presentation layer)
  createEmptyAccountname,
  // Reconciliation,
} from '@modules/types';

import {
  DashboardAccountsLocation,
  DashboardCollectionsLocation,
  DashboardMonitorsLocation,
} from '../../Routes';
import { useGlobalNames, useGlobalState } from '../../State';
import { Collections } from './Tabs/Collections';
import { DetailsView } from './Tabs/Details';
import { Monitors } from './Tabs/Monitors';

export const DashboardView = () => {
  const { chain } = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [showReversed, setShowReversed] = useState(false);
  const [showStaging, setShowStaging] = useState(false);
  const [showUnripe, setShowUnripe] = useState(false);
  const [hideZero, setHideZero] = useState('all');
  const [hideNamed, setHideNamed] = useState(false);
  const [hideReconciled, setHideReconciled] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [period, setPeriod] = useState('by tx');
  const [cancel, setCancel] = useState(false);

  const { currentAddress, setCurrentAddress } = useGlobalState();
  const { namesMap } = useGlobalNames();
  const { totalRecords, setTotalRecords } = useGlobalState();
  const {
    transactions,
    meta: transactionsMeta,
    addTransactions,
  } = useGlobalState();

  const { search: searchParams } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const addressParam = params.get('address');

    if (addressParam) {
      setCurrentAddress(addressParam);
    }
  }, [searchParams, setCurrentAddress]);

  // clean up mouse control when we unmount
  useEffect(() => {
    Mousetrap.bind('esc', () => setCancel(true));

    return () => {
      Mousetrap.unbind(['esc']);
    };
  }, []);

  const listRequest = useSdk(() => getList({
    chain,
    count: true,
    appearances: true,
    addrs: [currentAddress as string],
  }),
  () => currentAddress?.slice(0, 2) === '0x',
  [currentAddress, chain]) as CallStatus<ListStats[]>;

  useEffect(() => {
    if (!isSuccessfulCall(listRequest)) return;
    setTotalRecords(listRequest.data[0]?.nRecords);
  }, [listRequest, listRequest.type, setTotalRecords, showStaging, showUnripe]);

  // Run this effect until we fetch the last transaction
  const transactionsRequest = useSdk(() => getExport({
    chain,
    addrs: [currentAddress as string],
    fmt: 'json',
    cache: true,
    cacheTraces: true,
    staging: showStaging,
    // unripe: false, // unripe: '',
    ether: true,
    // dollars: false,
    articulate: true,
    accounting: true,
    // reversed: false,
    relevant: true,
    // summarize_by: 'monthly',
    firstRecord: transactions.length,
    maxRecords: String((() => {
      if (transactions.length < 20) return 10;
      if (transactions.length < 800) return 239;
      return 639; /* an arbitrary number not too big, not too small, that appears not to repeat */
    })()),
  }),
  () => Boolean(!cancel && currentAddress && totalRecords && transactions.length < totalRecords),
  [currentAddress, totalRecords, transactions.length, showStaging, chain]);

  useEffect(() => {
    if (isFailedCall(transactionsRequest)) {
      createErrorNotification({
        description: 'Could not fetch transactions',
      });
    }
  }, [transactionsRequest]);

  useEffect(() => {
    const stateToSet = !transactionsRequest.loading ? false : transactions.length < 10;

    setLoading(stateToSet);
  }, [transactions.length, transactionsRequest.loading]);

  useEffect(() => {
    if (!isSuccessfulCall(transactionsRequest)) return;
    addTransactions(
      transactionsRequest.data as Transaction[],
    );
  }, [addTransactions, transactionsRequest]);

  // Store raw data, because it can be huge and we don't want to have to reload it
  // every time a user toggles "hide reconciled".
  const transactionModels = useMemo(() => transactions
  // TODO: remove the next line (the filter) when we fix emptyData in useCommand (it should never
  // TODO: return an array with an empty object)
    // .sort((a: Transaction, b: Transaction) => {
    //   // if (!reverse) return 0;
    //   if (b.blockNumber === a.blockNumber) return b.transactionIndex - a.transactionIndex;
    //   return b.blockNumber - a.blockNumber;
    // })
    .filter(({ hash }) => Boolean(hash))
    .map((transaction, index) => {
      const newId = String(index + 1);
      const fromName = namesMap.get(transaction.from) || createEmptyAccountname();
      const toName = namesMap.get(transaction.to) || createEmptyAccountname();
      const staging = showStaging;

      return {
        ...transaction,
        id: newId,
        fromName,
        toName,
        staging,
        chain,
      };
    }), [namesMap, transactions, showStaging, chain]);

  // TODO(data): fix this if you can
  const theData = useMemo(() => transactionModels.filter((transaction) => {
    if (!hideReconciled) return true;

    return transaction?.statements?.some?.(({ reconciled }) => !reconciled);
  }), [hideReconciled, transactionModels]);

  const params: AccountViewParams = {
    loading,
    setLoading,
    userPrefs: {
      showReversed,
      setShowReversed,
      showStaging,
      setShowStaging,
      showUnripe,
      setShowUnripe,
      hideZero,
      setHideZero,
      hideNamed,
      setHideNamed,
      hideReconciled,
      setHideReconciled,
      showDetails,
      setShowDetails,
      period,
      setPeriod,
    },
    totalRecords,
    theData,
    theMeta: transactionsMeta,
  };

  const tabs = [
    { name: 'Monitors', location: DashboardMonitorsLocation, component: <Monitors /> },
    {
      name: 'Details',
      location: DashboardAccountsLocation,
      component: <DetailsView params={params} />,
    },
    { name: 'Collections', location: DashboardCollectionsLocation, component: <Collections /> },
  ];

  return (
    <BaseView
      title='Dashboard'
      cookieName='COOKIE_DASHBOARD'
      tabs={tabs}
    />
  );
};

declare type stateSetter<Type> = React.Dispatch<React.SetStateAction<Type>>;
export type UserPrefs = {
  showReversed: boolean;
  setShowReversed: stateSetter<boolean>;
  showStaging: boolean;
  setShowStaging: stateSetter<boolean>;
  showUnripe: boolean;
  setShowUnripe: stateSetter<boolean>;
  hideZero: string;
  setHideZero: stateSetter<string>;
  hideNamed: boolean;
  setHideNamed: stateSetter<boolean>;
  hideReconciled: boolean;
  setHideReconciled: stateSetter<boolean>;
  showDetails: boolean;
  setShowDetails: stateSetter<boolean>;
  period: string;
  setPeriod: stateSetter<string>;
};

export type AccountViewParams = {
  loading: boolean;
  setLoading: stateSetter<boolean>;
  userPrefs: UserPrefs;
  totalRecords: number | null;
  theData: any;
  theMeta: any;
};
