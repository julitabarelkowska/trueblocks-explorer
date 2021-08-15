import { DashboardAccountsHistoryLocation } from '../../../../../Routes';
import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { Transaction, TransactionArray } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Link } from 'react-router-dom';

declare type Evt = {
  evt: string;
  count: number;
};

export const Events = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;

  const counts = Object.create(null);
  theData.forEach((item: Transaction, i: number) => {
    item.receipt?.logs?.map((item: any) => {
      if (item.articulatedLog) {
        if (!counts[item.articulatedLog?.name]) counts[item.articulatedLog?.name] = 1;
        else counts[item.articulatedLog?.name] = Number(counts[item.articulatedLog?.name]) + 1;
      }
    });
  });

  const uniqItems: Evt[] = [];
  Object.keys(counts).map((key: any) => {
    uniqItems.push({
      evt: key,
      count: counts[key],
    });
  });

  uniqItems.sort(function (a: Evt, b: Evt) {
    if (b.count === a.count) return a.evt.localeCompare(b.evt);
    return b.count - a.count;
  });

  const top = uniqItems.filter((item: Evt, i: number) => i < 10);
  const remains = uniqItems.filter((item: Evt, i: number) => i >= 10);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <MyAreaChart title={'Top Ten Events'} items={top} columns={countSchema} table={true} />
      <MyAreaChart title={'Other Events'} items={remains} columns={countSchema} table={true} />
    </div>
  );
};

export const countSchema: ColumnsType<Evt> = [
  addColumn({
    title: 'Event',
    dataIndex: 'evt',
    configuration: {
      render: (field: string, record: Evt) => {
        if (!record) return <></>;
        return <Link to={DashboardAccountsHistoryLocation + '?event=' + field}>{field}</Link>;
      },
    },
  }),
  addColumn({
    title: 'Count',
    dataIndex: 'count',
  }),
];
