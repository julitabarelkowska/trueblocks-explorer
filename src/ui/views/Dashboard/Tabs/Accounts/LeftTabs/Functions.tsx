import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { Transaction, TransactionArray } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

export const Functions = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;

  const counts = Object.create(null);
  theData.forEach((item: any, i: number) => {
    const v = item.articulatedTx;
    if (v) {
      const k = v?.name + (item.isError ? ' (errored)' : '');
      if (!counts[k]) counts[k] = 1;
      else counts[k] = Number(counts[k]) + 1;
    }
  });

  const uniqItems: any = [];
  Object.keys(counts).map((key: any) => {
    uniqItems.push({
      func: key,
      count: counts[key],
    });
  });

  uniqItems.sort(function (a: any, b: any) {
    if (b.count === a.count) return a.func - b.func;
    return b.count - a.count;
  });

  const top = uniqItems.filter((item: any, i: number) => i < 10);
  const remains = uniqItems.filter((item: any, i: number) => i >= 10);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <MyAreaChart title={'Top Ten Functions'} items={top} columns={countSchema} table={true} />
      <MyAreaChart title={'Other Functions'} items={remains} columns={countSchema} table={true} />
    </div>
  );
};

export const countSchema: ColumnsType<Transaction> = [
  addColumn({
    title: 'Function',
    dataIndex: 'func',
  }),
  addColumn({
    title: 'Count',
    dataIndex: 'count',
  }),
];
