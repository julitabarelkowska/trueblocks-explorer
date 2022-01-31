import React from 'react';

import { getReceipts } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

import { useGlobalState2 } from '../../../State';

// TODO(tjayrush): hard coded data
export const Receipts = () => {
  const { chain } = useGlobalState2();
  return (
    <RawDataTab
      name='logs'
      makeRequest={() => getReceipts({
        chain,
        transactions: ['12001001.1'],
        articulate: true,
      })}
    />
  );
};
