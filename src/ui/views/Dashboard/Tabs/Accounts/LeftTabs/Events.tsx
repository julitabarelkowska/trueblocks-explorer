import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { Transaction, TransactionArray } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

export const Events = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;

  const counts = Object.create(null);
  theData.forEach((item: any, i: number) => {
    item.receipt?.logs?.map((item: any) => {
      if (item.articulatedLog) {
        if (!counts[item.articulatedLog?.name]) counts[item.articulatedLog?.name] = 1;
        else counts[item.articulatedLog?.name] = Number(counts[item.articulatedLog?.name]) + 1;
      }
    });
  });

  const uniqItems: any = [];
  Object.keys(counts).map((key: any) => {
    uniqItems.push({
      evt: key,
      count: counts[key],
    });
  });

  uniqItems.sort(function (a: any, b: any) {
    if (b.count === a.count) return a.evt - b.evt;
    return b.count - a.count;
  });

  const top = uniqItems.filter((item: any, i: number) => i < 10);
  const remains = uniqItems.filter((item: any, i: number) => i >= 10);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <MyAreaChart title={'Top Ten Events'} items={top} columns={countSchema} table={true} />
      <MyAreaChart title={'Other Events'} items={remains} columns={countSchema} table={true} />
    </div>
  );
};

export const countSchema: ColumnsType<Transaction> = [
  addColumn({
    title: 'Event',
    dataIndex: 'evt',
  }),
  addColumn({
    title: 'Count',
    dataIndex: 'count',
  }),
];
