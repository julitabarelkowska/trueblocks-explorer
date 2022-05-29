import React, { useCallback, useEffect, useState } from 'react';

import { useGlobalState } from '@state';
import { GetNeighborsResult } from 'src/ui/datastore/messages';

import { useDatastore } from '@hooks/useDatastore';

export const Neighbors = () => {
  const [items, setItems] = useState<GetNeighborsResult>([]);
  const {
    chain,
    currentAddress,
    transactionsFetchedByWorker,
  } = useGlobalState();
  const {
    getNeighbors,
  } = useDatastore();

  const sendMessage = useCallback(async () => {
    if (!currentAddress) return;

    const results = await getNeighbors({ chain: chain.chain, address: currentAddress });
    setItems(results);
  }, [chain, currentAddress, getNeighbors]);

  useEffect(() => {
    if (transactionsFetchedByWorker > 0) {
      sendMessage();
    }
  }, [sendMessage, transactionsFetchedByWorker]);

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <div>Neighbors</div>
      <pre>{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
};
