import React from 'react';

import { getTransactions } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

import { useGlobalState } from '../../../State';

// TODO(tjayrush): hard coded data
export const Transactions = () => {
  const { chain } = useGlobalState();
  return (
    <RawDataTab
      name='logs'
      makeRequest={() => getTransactions({
        chain: chain.chain,
        transactions: ['12001001.0'],
        cache: true,
        articulate: true,
      })}
    />
  );
};
