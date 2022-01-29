import React from 'react';

import { getTraces } from '@sdk';

import { RawDataTab } from '@components/RawDataTab';

// TODO(tjayrush): hard coded data
export const Traces = () => (
  <RawDataTab
    name='logs'
    makeRequest={() => getTraces({
      chain: 'mainnet', // TODO: BOGUS `${process.env.CHAIN}`
      transactions: ['12001001.0'],
      articulate: true,
    })}
  />
);
