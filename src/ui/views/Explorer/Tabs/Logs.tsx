import React from 'react';

import { getLogs } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

import { useGlobalState } from '../../../State';

// TODO(tjayrush): hard coded data
export const Logs = () => {
  const { chain } = useGlobalState();
  return (
    <RawDataTab
      name='logs'
      makeRequest={() => getLogs({
        chain: chain.chain,
        transactions: ['12001001.1'],
        articulate: true,
      })}
    />
  );
};
