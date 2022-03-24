import React, { useCallback, useEffect, useState } from 'react';

import { useGlobalState } from '@state';
import { GetNeighborsResult, LoadTransactionsStatus } from 'src/ui/datastore/messages';

import { useDatastore } from '@hooks/useDatastore';

export const Neighbors = () => {
  const [items, setItems] = useState<GetNeighborsResult>([]);
  const { currentAddress } = useGlobalState();
  const {
    onMessage,
    getNeighbors,
  } = useDatastore();

  const sendMessage = useCallback(() => {
    if (!currentAddress) return;

    getNeighbors({ address: currentAddress });
  }, [currentAddress, getNeighbors]);

  useEffect(() => onMessage<GetNeighborsResult>('getNeighbors', (message) => {
    setItems(message.result);
  }), [onMessage]);

  useEffect(() => onMessage<LoadTransactionsStatus>('loadTransactions', sendMessage), [onMessage, sendMessage]);

  useEffect(() => sendMessage(), [sendMessage]);

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <div>Neighbors</div>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
};
