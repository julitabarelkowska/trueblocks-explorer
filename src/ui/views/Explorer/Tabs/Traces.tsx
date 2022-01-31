import React from 'react';

import { getTraces } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

import { useGlobalState2 } from '../../../State';

// TODO(tjayrush): hard coded data
export const Traces = () => {
  const { chain } = useGlobalState2();
  return (
    <RawDataTab
      name='logs'
      makeRequest={() => getTraces({
        chain,
        transactions: ['12001001.0'],
        articulate: true,
      })}
    />
  );
};
