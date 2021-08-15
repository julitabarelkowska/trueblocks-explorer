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

export const Functions = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;

  const counts = Object.create(null);
  theData.forEach((item: Transaction, i: number) => {
    if (item.articulatedTx) {
      const k = item.articulatedTx.name + (item.isError ? ' (errored)' : '');
      if (!counts[k]) counts[k] = 1;
      else counts[k] = Number(counts[k]) + 1;
    }
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
      <MyAreaChart title={'Top Ten Functions'} items={top} columns={countSchema} table={true} />
      <MyAreaChart title={'Other Functions'} items={remains} columns={countSchema} table={true} />
    </div>
  );
};

export const countSchema: ColumnsType<Evt> = [
  addColumn({
    title: 'Function',
    dataIndex: 'evt',
    configuration: {
      render: (field: string, record: Evt) => {
        if (!record) return <></>;
        return <Link to={DashboardAccountsHistoryLocation + '?function=' + field}>{field}</Link>;
      },
    },
  }),
  addColumn({
    title: 'Count',
    dataIndex: 'count',
  }),
];
