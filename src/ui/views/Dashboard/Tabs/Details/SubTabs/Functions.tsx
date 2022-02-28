import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Transaction } from '@sdk';

import { Loading } from '@components/Loading';
import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { usePathWithAddress } from '@hooks/paths';
import { createWrapper } from '@hooks/useSearchParams';
import {
  ItemCounter, ItemCounterArray,
} from '@modules/types';

import { DashboardAccountsHistoryLocation } from '../../../../../Routes';

export const Functions = ({ theData, loading }: { theData: Transaction[]; loading: boolean }) => {
  const generatePathWithAddress = usePathWithAddress();
  const historyUrl = generatePathWithAddress(DashboardAccountsHistoryLocation);
  const schema = useMemo(() => getSchema(historyUrl), [historyUrl]);

  if (!theData) return <></>;

  const counts: Record<string, number> = {};
  theData.forEach((item: Transaction) => {
    if (item.articulatedTx) {
      const k = item.articulatedTx.name + (item.isError ? ' (errored)' : '');
      if (!counts[k]) counts[k] = 1;
      else counts[k] = Number(counts[k]) + 1;
    }
  });

  const uniqItems: ItemCounterArray = [];
  Object.keys(counts).map((key: any) => {
    uniqItems.push({
      evt: key,
      count: counts[key],
    });
    return null;
  });

  uniqItems.sort((a: ItemCounter, b: ItemCounter) => {
    if (b.count === a.count) return a.evt.localeCompare(b.evt);
    return b.count - a.count;
  });

  const top = uniqItems.filter((item: ItemCounter, i: number) => i < 10);
  const remains = uniqItems.filter((item: ItemCounter, i: number) => i >= 10);

  return (
    <Loading loading={loading}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <MyAreaChart title='Top Ten Functions' items={top} columns={schema} table />
        <MyAreaChart title='Other Functions' items={remains} columns={schema} table />
      </div>
    </Loading>
  );
};

const getSchema = (historyUrl: string) => [
  addColumn({
    title: 'Function',
    dataIndex: 'evt',
    configuration: {
      render: (field: string, record: ItemCounter) => {
        if (!record) return <></>;
        return (
          <Link to={
            ({ search }) => `${historyUrl}?${createWrapper(search).set('function', field)}`
          }
          >
            {field}
          </Link>
        );
      },
    },
  }),
  addColumn({
    title: 'Count',
    dataIndex: 'count',
  }),
];
