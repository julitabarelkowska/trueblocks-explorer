import React, { useCallback, useEffect, useState } from 'react';

import { useGlobalState } from '@state';
import { GetGasResult, LoadTransactionsStatus } from 'src/ui/datastore/messages';

import { useDatastore } from '@hooks/useDatastore';

export const Gas = () => {
  const [items, setItems] = useState<GetGasResult>([]);
  const { currentAddress } = useGlobalState();
  const {
    onMessage,
    getGas,
  } = useDatastore();

  const sendMessage = useCallback(() => {
    if (!currentAddress) return;

    getGas({ address: currentAddress });
  }, [currentAddress, getGas]);

  useEffect(() => onMessage<GetGasResult>('getGas', (message) => {
    setItems(message.result);
  }), [onMessage]);

  useEffect(() => onMessage<LoadTransactionsStatus>('loadTransactions', sendMessage), [onMessage, sendMessage]);

  useEffect(() => sendMessage(), [sendMessage]);

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <pre>
        len:
        {items.length}
      </pre>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
};
