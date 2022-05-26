import React, { useCallback, useEffect, useState } from 'react';

import { useGlobalState } from '@state';
import { GetGasResult } from 'src/ui/datastore/messages';

import { useDatastore } from '@hooks/useDatastore';

export const Gas = () => {
  const [items, setItems] = useState<GetGasResult>([]);
  const {
    chain,
    currentAddress,
    transactionsFetchedByWorker,
  } = useGlobalState();
  const {
    getGas,
  } = useDatastore();

  const sendMessage = useCallback(async () => {
    if (!currentAddress) return;

    const results = await getGas({ chain, address: currentAddress });
    setItems(results);
  }, [chain, currentAddress, getGas]);

  useEffect(() => {
    if (transactionsFetchedByWorker > 0) {
      sendMessage();
    }
  }, [sendMessage, transactionsFetchedByWorker]);

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
