import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Transaction } from '@sdk';
import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { BaseView } from '@components/BaseView';
import { FilterButton } from '@components/FilterButton';
import { addColumn, BaseTable } from '@components/Table';
import { usePathWithAddress } from '@hooks/paths';
import { useDatastore } from '@hooks/useDatastore';
import { useName } from '@hooks/useName';
import { useSearchParams } from '@hooks/useSearchParams';
import { TransactionModel } from '@modules/types/models/Transaction';

import {
  DashboardAccountsHistoryCustomLocation,
  DashboardAccountsHistoryEventsLocation,
  DashboardAccountsHistoryFunctionsLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsHistoryReconsLocation,
} from '../../../../../Routes';
import { useGlobalState } from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';
import { DateDisplay } from '../components/DateDisplay';
import { ExtraDisplay } from '../components/ExtraDisplay';
import { FromToDisplay } from '../components/FromToDisplay';
import { StatementDisplay } from '../components/StatementDisplay';
import { HistoryEvents } from './HistoryEvents';
import { HistoryFunctions } from './HistoryFunctions';
import { HistoryRecons } from './HistoryRecons';

export const History = ({ params }: { params: Omit<AccountViewParams, 'theData'> }) => {
  const { loading } = params;
  const {
    chain,
    currentAddress,
    totalRecords,
    setTotalRecords,
    filteredRecords,
    setFilteredRecords,
    transactionsLoaded,
    transactionsFetchedByWorker,
    filters,
  } = useGlobalState();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [theData, setTheData] = useState<Transaction[]>([]);
  const [selectedItem, setSelectedItem] = useState<Transaction>();
  const [assetNameToDisplay, setAssetNameToDisplay] = useState('');
  // This will keep the reference to the last loaded page, even if `page` state
  // changes, so we can compare pages when we get data from the worker.
  const loadedPage = useRef(0);
  // Keep the information about whether or not the last page was filtered
  const dataFiltered = useRef(false);

  const history = useHistory();
  const { pathname } = useLocation();
  const searchParams = useSearchParams();
  const {
    getPage,
  } = useDatastore();
  useName(
    filters.active ? [filters.asset] : [],
    ([name]) => setAssetNameToDisplay(name?.name || ''),
  );

  const siderParams = useMemo(() => ({
    ...params,
    theData,
  }), [params, theData]);
  const recordCount = useMemo(
    () => (filters.active ? filteredRecords : totalRecords),
    [filteredRecords, filters.active, totalRecords],
  );
  const [
    assetToFilterBy,
    eventToFilterBy,
    functionToFilterBy,
  ] = useMemo(() => {
    if (!filters.active) return ['', '', ''];
    return [
      'asset' in filters ? filters.asset : '',
      'event' in filters ? filters.event : '',
      'function' in filters ? filters.function : '',
    ];
  }, [filters]);

  const onSelectionChange = useCallback((item) => setSelectedItem(item), []);

  const onTablePageChange = useCallback((
    { page: newPage, pageSize: newPageSize }: { page: number, pageSize: number },
  ) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);
  const getPageAndUpdate = useCallback(() => {
    if (!currentAddress) return;

    if (!transactionsLoaded) return;

    getPage({
      chain: chain.chain,
      address: currentAddress,
      page,
      pageSize,
      filtered: filters.active,
    })
      .then((result) => {
        if (!filters.active && result.knownTotal > totalRecords) {
          setTotalRecords(result.knownTotal);
        }

        if (filters.active) {
          setFilteredRecords(result.knownTotal);
        }

        if (result.page !== page) return;

        setTheData(result.items);
        loadedPage.current = result.page;
        dataFiltered.current = filters.active;
      });
  }, [
    chain,
    currentAddress,
    filters.active,
    getPage,
    page,
    pageSize,
    setFilteredRecords,
    setTotalRecords,
    totalRecords,
    transactionsLoaded,
  ]);

  useEffect(() => {
    // This makes the effect dependant on transactionsFetchedByWorker, so each time we load
    // more transactions, this code will fire and load them (if we're on the right page).
    if (!transactionsFetchedByWorker) return;

    // This prevents from reloading the same data if two conditions are same: 1. same page;
    // 2. same dataset (filtered or not)
    if ((page === loadedPage.current && theData.length === pageSize) && dataFiltered.current === filters.active) return;

    // if we reach this point, then we have to load the data
    getPageAndUpdate();

    // We keep dependency on whole `filters` object, because each time new filter is set in the store, we have
    // to re-fetch the data
  }, [filters, getPageAndUpdate, page, pageSize, theData.length, transactionsFetchedByWorker]);

  // Update selection when we change filters status
  useEffect(() => {
    if (theData.length) {
      onSelectionChange(theData[0]);
    }
  }, [filters.active, onSelectionChange, theData]);

  const makeClearFilter = (searchParamKey: string) => () => {
    const searchString = searchParams.delete(searchParamKey).toString();
    history.replace(`${pathname}?${searchString}`);
  };

  const activeAssetFilter = (
    <FilterButton
      visible={Boolean(assetToFilterBy)}
      onClick={makeClearFilter('asset')}
    >
      {`Asset: ${assetNameToDisplay || assetToFilterBy}`}
    </FilterButton>
  );

  const activeEventFilter = (
    <FilterButton
      visible={Boolean(eventToFilterBy)}
      onClick={makeClearFilter('event')}
    >
      {`Event: ${eventToFilterBy}`}
    </FilterButton>
  );

  const activeFunctionFilter = (
    <FilterButton
      visible={Boolean(functionToFilterBy)}
      onClick={makeClearFilter('function')}
    >
      {`Function: ${functionToFilterBy}`}
    </FilterButton>
  );

  return (
    <div>
      <Row wrap={false} gutter={16}>
        <Col flex='3'>
          {activeAssetFilter}
          {activeEventFilter}
          {activeFunctionFilter}
          <BaseTable
            dataSource={theData}
            streamSource
            columns={transactionSchema}
            loading={loading}
            extraData={currentAddress}
            // name='history'
            totalRecords={recordCount}
            // activePage={page}
            showRowPlaceholder
            onSelectionChange={onSelectionChange}
            onPageChange={onTablePageChange}
          />
        </Col>
        <Col flex='2'>
          {/* this minWidth: 0 stops children from overflowing flex parent */}
          <div style={{ minWidth: 0 }} hidden={!theData.length}>
            <AccountHistorySider record={selectedItem as unknown as TransactionModel} params={siderParams} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export const AccountHistorySider = ({ record, params }: { record: TransactionModel; params: AccountViewParams }) => {
  const generatePathWithAddress = usePathWithAddress();

  const tabs = [
    {
      name: 'Events',
      location: [
        generatePathWithAddress(DashboardAccountsHistoryLocation),
        generatePathWithAddress(DashboardAccountsHistoryEventsLocation),
      ],
      component: <HistoryEvents record={record} />,
    },
    {
      name: 'Function',
      location: generatePathWithAddress(DashboardAccountsHistoryFunctionsLocation),
      component: <HistoryFunctions record={record} />,
    },
    {
      name: 'Reconciliations',
      location: generatePathWithAddress(DashboardAccountsHistoryReconsLocation),
      component: <HistoryRecons record={record} params={params} />,
    },
    {
      name: 'Custom',
      location: generatePathWithAddress(DashboardAccountsHistoryCustomLocation),
      component: <pre>{JSON.stringify(record?.to, null, 2)}</pre>,
    },
  ];

  if (!record) return <></>;
  return <BaseView title='' cookieName='COOKIE_DASHBOARD_DETAILS' tabs={tabs} />;
};

export const transactionSchema: ColumnsType<TransactionModel> = [
  addColumn({
    title: 'Date',
    dataIndex: 'date',
    configuration: {
      width: '15%',
      render: (unused, record) => <DateDisplay record={record} />,
    },
  }),
  addColumn({
    title: 'From / To',
    dataIndex: 'from',
    configuration: {
      width: '30%',
      render: (unused, record) => <FromToDisplay record={record} />,
    },
  }),
  addColumn({
    title: 'Reconciliations (asset, beg, in, out, gasOut, end, check)',
    dataIndex: 'compressedTx',
    configuration: {
      width: '50%',
      render: (unused, record) => <StatementDisplay record={record} />,
    },
  }),
  addColumn({
    title: '',
    dataIndex: 'statements',
    configuration: {
      width: '3%',
      render: (unused, record) => <ExtraDisplay record={record} />,
    },
  }),
];
