import React, {
  useCallback,
  useEffect, useMemo, useState,
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
import { useSearchParams } from '@hooks/useSearchParams';
import {
  applyFilters,
} from '@modules/filters/transaction';
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

const searchParamAsset = 'asset';
const searchParamEvent = 'event';
const searchParamFunction = 'function';

export const History = ({ params }: { params: Omit<AccountViewParams, 'theData'> }) => {
  const { loading } = params;
  const [theData, setTheData] = useState<Transaction[]>([]);
  const { showReversed } = params.userPrefs;
  const {
    currentAddress, namesMap, totalRecords, transactionsFetchedByWorker,
  } = useGlobalState();
  const history = useHistory();
  const { pathname } = useLocation();
  const [assetToFilterBy, setAssetToFilterBy] = useState('');
  const [eventToFilterBy, setEventToFilterBy] = useState('');
  const [functionToFilterBy, setFunctionToFilterBy] = useState('');
  const [selectedItem, setSelectedItem] = useState<typeof theData>();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const {
    onMessage,
    getPage,
  } = useDatastore();

  const getPageItems = useCallback((newPage: number, newPageSize: number) => {
    if (!currentAddress) return;

    getPage({
      address: currentAddress,
      page: newPage,
      pageSize: newPageSize,
    });
  }, [currentAddress, getPage]);

  useEffect(() => {
    if (transactionsFetchedByWorker >= page * pageSize && theData.length === pageSize) return;

    getPageItems(page, pageSize);
  }, [getPageItems, page, pageSize, theData.length, transactionsFetchedByWorker]);

  useEffect(() => onMessage<Transaction[]>((message) => {
    if (message.call !== 'getPage') return;

    setTheData(message.result);
  }), [currentAddress, onMessage]);

  const onTablePageChange = useCallback((
    { page: newPage, pageSize: newPageSize }: { page: number, pageSize: number },
  ) => {
    setPage(newPage);
    setPageSize(newPageSize);
    getPageItems(newPage, newPageSize);
  }, [getPageItems]);

  const assetNameToDisplay = useMemo(() => {
    if (!assetToFilterBy) return '';

    const matchedName = namesMap.get(assetToFilterBy);

    if (!matchedName) return '';

    return matchedName.name;
  }, [assetToFilterBy, namesMap]);

  useEffect(
    () => {
      setAssetToFilterBy(
        searchParams.get(searchParamAsset) || '',
      );

      setEventToFilterBy(
        searchParams.get(searchParamEvent) || '',
      );

      setFunctionToFilterBy(
        searchParams.get(searchParamFunction) || '',
      );
    },
    [searchParams],
  );

  const filteredData = useMemo(() => {
    let ret;
    if (!assetToFilterBy && !eventToFilterBy && !functionToFilterBy) {
      ret = theData;
    } else {
      ret = applyFilters(theData, {
        assetAddress: assetToFilterBy,
        eventName: eventToFilterBy,
        functionName: functionToFilterBy,
      });
    }
    if (showReversed) {
      // TODO: we used to use TransactionModel here (with from and to names and some additional info filled in)
      return ret.sort((b: Transaction, a: Transaction) => {
        if (a.blockNumber === b.blockNumber) return a.transactionIndex - b.transactionIndex;
        return a.blockNumber - b.blockNumber;
      });
    }
    return ret.sort((a: Transaction, b: Transaction) => {
      if (a.blockNumber === b.blockNumber) return a.transactionIndex - b.transactionIndex;
      return a.blockNumber - b.blockNumber;
    });
  }, [assetToFilterBy, eventToFilterBy, functionToFilterBy, theData, showReversed]);

  const makeClearFilter = (searchParamKey: string) => () => {
    const searchString = searchParams.delete(searchParamKey).toString();
    history.replace(`${pathname}?${searchString}`);
  };

  const activeAssetFilter = (
    <FilterButton
      visible={Boolean(assetToFilterBy)}
      onClick={makeClearFilter(searchParamAsset)}
    >
      {`Asset: ${assetNameToDisplay || assetToFilterBy}`}
    </FilterButton>
  );

  const activeEventFilter = (
    <FilterButton
      visible={Boolean(eventToFilterBy)}
      onClick={makeClearFilter(searchParamEvent)}
    >
      {`Event: ${eventToFilterBy}`}
    </FilterButton>
  );

  const activeFunctionFilter = (
    <FilterButton
      visible={Boolean(functionToFilterBy)}
      onClick={makeClearFilter(searchParamFunction)}
    >
      {`Function: ${functionToFilterBy}`}
    </FilterButton>
  );

  const onSelectionChange = useCallback((item) => setSelectedItem(item), []);
  const siderParams = useMemo(() => ({
    ...params,
    theData,
  }), [params, theData]);

  return (
    <div>
      <Row wrap={false} gutter={16}>
        <Col flex='3'>
          {activeAssetFilter}
          {activeEventFilter}
          {activeFunctionFilter}
          <BaseTable
            dataSource={filteredData}
            columns={transactionSchema}
            loading={loading}
            extraData={currentAddress}
            name='history'
            totalRecords={totalRecords}
            activePage={page}
            showRowPlaceholder
            onSelectionChange={onSelectionChange}
            onPageChange={onTablePageChange}
          />
        </Col>
        <Col flex='2'>
          {/* this minWidth: 0 stops children from overflowing flex parent */}
          <div style={{ minWidth: 0 }}>
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
