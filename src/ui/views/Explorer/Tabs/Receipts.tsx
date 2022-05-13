import React from 'react';

import { getReceipts } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

import { useGlobalState } from '../../../State';

// TODO(tjayrush): hard coded data
export const Receipts = () => {
  const { chain } = useGlobalState();
  return (
    <RawDataTab
      name='logs'
      makeRequest={() => getReceipts({
        chain: chain.chain,
        transactions: ['12001001.1'],
        articulate: true,
      })}
    />
  );
};
