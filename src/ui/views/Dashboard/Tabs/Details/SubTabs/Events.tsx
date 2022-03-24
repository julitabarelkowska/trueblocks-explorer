import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Link } from 'react-router-dom';

import { useGlobalState } from '@state';
import { GetEventsItemsResult, LoadTransactionsStatus } from 'src/ui/datastore/messages';

import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { usePathWithAddress } from '@hooks/paths';
import { useDatastore } from '@hooks/useDatastore';
import { createWrapper } from '@hooks/useSearchParams';
import {
  ItemCounter, ItemCounterArray,
} from '@modules/types';

import { DashboardAccountsHistoryLocation } from '../../../../../Routes';

export const Events = () => {
  const generatePathWithAddress = usePathWithAddress();
  const historyUrl = generatePathWithAddress(DashboardAccountsHistoryLocation);
  const schema = useMemo(() => getSchema(historyUrl), [historyUrl]);

  const [items, setItems] = useState<ItemCounterArray>([]);
  const { currentAddress } = useGlobalState();
  const {
    onMessage,
    getEventsItems,
  } = useDatastore();

  const sendMessage = useCallback(() => {
    if (!currentAddress) return;

    getEventsItems({ address: currentAddress });
  }, [currentAddress, getEventsItems]);

  useEffect(() => onMessage<GetEventsItemsResult>('getEventsItems', (message) => {
    setItems(message.result);
  }), [onMessage]);

  useEffect(() => onMessage<LoadTransactionsStatus>('loadTransactions', sendMessage), [onMessage, sendMessage]);

  useEffect(() => sendMessage(), [sendMessage]);

  const top = items.slice(0, 10);
  const remains = items.slice(10);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <MyAreaChart title='Top Ten Events' items={top} columns={schema} table />
      <MyAreaChart title='Other Events' items={remains} columns={schema} table />
    </div>
  );
};

const getSchema = (historyUrl: string) => [
  addColumn({
    title: 'Event',
    dataIndex: 'evt',
    configuration: {
      render: (field: string, record: ItemCounter) => {
        if (!record) return <></>;

        return (
          <Link to={
            ({ search }) => `${historyUrl}?${createWrapper(search).set('event', field)}`
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
