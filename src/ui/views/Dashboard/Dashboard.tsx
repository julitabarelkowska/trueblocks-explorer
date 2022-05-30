import React, {
  useEffect, useMemo, useState,
} from 'react';
import {
  generatePath, useParams,
} from 'react-router-dom';

import { proxy } from 'comlink';
import Mousetrap from 'mousetrap';

import { BaseView } from '@components/BaseView';
import { useDatastore } from '@hooks/useDatastore';
import { useSearchParams } from '@hooks/useSearchParams';

import {
  DashboardAccountsAddressLocation,
  DashboardAccountsAssetsLocation,
  // DashboardAccountsChartsLocation,
  DashboardAccountsEventsLocation,
  DashboardAccountsFunctionsLocation,
  DashboardAccountsGasLocation,
  DashboardAccountsHistoryCustomLocation,
  DashboardAccountsHistoryEventsLocation,
  DashboardAccountsHistoryFunctionsLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsHistoryReconsLocation,
  DashboardAccountsNeighborsLocation,
  DashboardCollectionsLocation,
  DashboardLocation,
  DashboardMonitorsLocation,
  RootLocation,
} from '../../Routes';
import { useGlobalState } from '../../State';
import { Collections } from './Tabs/Collections';
import { DetailsView } from './Tabs/Details';
import { Monitors } from './Tabs/Monitors';

const searchParamAsset = 'asset';
const searchParamEvent = 'event';
const searchParamFunction = 'function';

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
  const [, setCancel] = useState(false);

  const { chain } = useGlobalState();
  const { currentAddress, setCurrentAddress, setTransactionsLoaded } = useGlobalState();
  const {
    totalRecords,
    setTotalRecords,
    setFilteredRecords,
    setTransactionsFetchedByWorker,
    meta: transactionsMeta,
    setTransactions,
    setFilters,
  } = useGlobalState();
  const {
    clearPerAccountStores,
    loadTransactions,
    getTransactionsTotal,
    cancelLoadTransactions,
    setActiveFilters,
  } = useDatastore();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ address: string }>();

  const addressParam = useMemo(() => routeParams.address, [routeParams.address]);

  useEffect(() => {
    const asset = searchParams.get(searchParamAsset) || '';
    const event = searchParams.get(searchParamEvent) || '';
    const functionName = searchParams.get(searchParamFunction) || '';

    if (!currentAddress) return;

    if (!asset && !event && !functionName) {
      setFilters({ active: false });
      return;
    }

    const filtersSet = { asset, event, function: functionName };

    setActiveFilters({
      chain: chain.chain,
      address: currentAddress,
      filters: filtersSet,
    });
    setFilters({ active: true, ...filtersSet });
  }, [chain, currentAddress, searchParams, setActiveFilters, setFilters]);

  useEffect(() => {
    if (!currentAddress) return undefined;

    setTransactionsLoaded(false);
    getTransactionsTotal({ chain: chain.chain, addresses: [currentAddress] })
      .then((stats) => {
        setTotalRecords(stats[0].nRecords);
      });

    return () => {
      clearPerAccountStores();
    };
  }, [chain, clearPerAccountStores, currentAddress, getTransactionsTotal, setTotalRecords, setTransactionsLoaded]);

  useEffect(() => {
    if (!currentAddress) return;

    loadTransactions({
      chain: chain.chain,
      address: currentAddress,
    },
    proxy(({ total, filtered }) => {
      setTransactionsFetchedByWorker(total);
      setFilteredRecords(filtered);
      setTransactionsLoaded(true);
    }));
  }, [
    chain,
    currentAddress,
    getTransactionsTotal,
    loadTransactions,
    setTotalRecords,
    setFilteredRecords,
    setTransactionsFetchedByWorker,
    setTransactionsLoaded,
  ]);

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
  useEffect(() => {
    const address = addressParam;

    if (currentAddress && currentAddress !== address) {
      cancelLoadTransactions({ chain: chain.chain, address: currentAddress });
    }

    if (address) {
      setCurrentAddress(address);
    }
  }, [cancelLoadTransactions, currentAddress, addressParam, setCurrentAddress, chain]);

  //----------------------
  useEffect(() => {
    setTransactions([]);
    setTotalRecords(0);
  }, [setTransactions, chain, setTotalRecords]);

  // TODO(tjayrush): Remove this Omit since theData is no longer part of AccountViewParams
  const params: Omit<AccountViewParams, 'theData'> = useMemo(() => ({
    loading,
    setLoading,
    totalRecords,
    // theData,
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
  }), [hideNamed, hideReconciled, hideZero, loading, period, showDetails, showReversed, showStaging, showUnripe, totalRecords, transactionsMeta]);

  const detailsPaths = useMemo(() => [
    DashboardAccountsAddressLocation,
    DashboardAccountsAssetsLocation,
    DashboardAccountsHistoryLocation,
    DashboardAccountsHistoryReconsLocation,
    DashboardAccountsHistoryFunctionsLocation,
    DashboardAccountsHistoryEventsLocation,
    DashboardAccountsHistoryCustomLocation,
    DashboardAccountsNeighborsLocation,
    DashboardAccountsGasLocation,
    DashboardAccountsFunctionsLocation,
    DashboardAccountsEventsLocation,
  ], []);

  const tabs = useMemo(() => [
    {
      name: 'Monitors',
      location: [
        DashboardMonitorsLocation,
        DashboardLocation,
        RootLocation,
      ],
      component: <Monitors />,
    },
    {
      name: 'Details',
      location: detailsPaths.map((path) => generatePath(path, { address: String(currentAddress) })),
      disabled: !currentAddress,
      component: <DetailsView params={params} />,
    },
    { name: 'Collections', location: DashboardCollectionsLocation, component: <Collections /> },
  ], [currentAddress, detailsPaths, params]);

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
