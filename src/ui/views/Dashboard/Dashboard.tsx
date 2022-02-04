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

  const { chain } = useGlobalState();
  const { currentAddress, setCurrentAddress } = useGlobalState();
  const { namesMap } = useGlobalNames();
  const { totalRecords, setTotalRecords } = useGlobalState();
  const {
    transactions, meta: transactionsMeta, setTransactions, addTransactions,
  } = useGlobalState();

  //----------------------
  // This adds (and cleans up) the escape key to allow quiting the transfer mid-way
  useEffect(() => {
    Mousetrap.bind('esc', () => setCancel(true));
    return () => {
      Mousetrap.unbind(['esc']);
    };
  }, []);

  //----------------------
  // Fires when the address switches and kicks off the whole process of re-building the data
  const { search: searchParams } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const addressParam = params.get('address');
    if (addressParam) {
      setCurrentAddress(addressParam);
    }
  }, [searchParams, setCurrentAddress]);

  //----------------------
  // Fires when the address changes and builds the request transaction count
  const listRequest = useSdk(() => getList({
    chain,
    count: true,
    appearances: true,
    addrs: [currentAddress as string],
  }),
  () => (currentAddress?.slice(0, 2) === '0x' && !!chain),
  [currentAddress, chain]) as CallStatus<ListStats[]>;

  //----------------------
  // Fires when listRequest changes and sets the transaction count
  useEffect(() => {
    if (!isSuccessfulCall(listRequest)) return;
    setTotalRecords(listRequest.data[0]?.nRecords);
  }, [listRequest, listRequest.type, setTotalRecords]);

  //----------------------
  // Fires when the number of records or the address changes, repeats until all transactions are fetched
  const transactionsRequest = useSdk(() => getExport({
    chain,
    addrs: [currentAddress as string],
    fmt: 'json',
    cache: true,
    cacheTraces: true,
    staging: showStaging,
    // unripe: showUnripe,
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
  [totalRecords, transactions.length, currentAddress, showStaging]);

  //----------------------
  // Fires when there are new transactions, appends them to the growing array
  useEffect(() => {
    if (!isSuccessfulCall(transactionsRequest)) return;
    addTransactions(transactionsRequest.data as Transaction[]);
  }, [addTransactions, transactionsRequest]);

  //----------------------
  // First when new transactions are present, reports an error if any
  useEffect(() => {
    if (isFailedCall(transactionsRequest)) {
      createErrorNotification({
        description: 'Could not fetch transactions',
      });
    }
  }, [transactionsRequest]);

  //----------------------
  // Enhance the data with some names and other data we need
  const theData = useMemo(() => transactions
    .map((transaction, index) => {
      const id = String(index + 1);
      const fromName = namesMap.get(transaction.from) || createEmptyAccountname();
      const toName = namesMap.get(transaction.to) || createEmptyAccountname();
      const staging = showStaging;
      return {
        ...transaction,
        id,
        fromName,
        toName,
        staging,
        chain,
      };
    }), [namesMap, transactions, chain, showStaging]); // TODO: the staging data should come from the backend

  //----------------------
  // Sets and unsets the loading flag
  useEffect(() => {
    const stateToSet = !transactionsRequest.loading ? false : transactions.length < 10;
    setLoading(stateToSet);
  }, [transactions.length, transactionsRequest.loading]);

  const params: AccountViewParams = {
    loading,
    setLoading,
    totalRecords,
    theData,
    theMeta: transactionsMeta,
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
  totalRecords: number | null;
  theData: any;
  theMeta: any;
  userPrefs: UserPrefs;
};
