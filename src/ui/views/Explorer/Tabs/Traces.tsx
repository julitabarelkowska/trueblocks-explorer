import React from 'react';

import { getTraces } from 'trueblocks-sdk';

import { RawDataTab } from '@components/RawDataTab';

import { useGlobalState } from '../../../State';

// TODO(tjayrush): hard coded data
export const Traces = () => {
  const { chain } = useGlobalState();
  return (
    <RawDataTab
      name='logs'
      makeRequest={() => getTraces({
        chain: chain.chain,
        transactions: ['12001001.0'],
        articulate: true,
      })}
    />
  );
};
