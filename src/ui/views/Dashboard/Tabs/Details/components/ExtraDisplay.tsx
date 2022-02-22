import React from 'react';

import {
  Transaction,
} from '@sdk';

import { useGlobalState } from '../../../../../State';

// TODO: BOGUS - per chain data
export const ExtraDisplay = ({ record }: { record: Transaction}) => {
  const { chain } = useGlobalState();
  if (chain === 'gnosis') {
    return (
      <a target='_blank' href={`https://blockscout.com/xdai/mainnet/tx/${record.hash}`} rel='noreferrer'>
        ES
      </a>
    );
  }
  return (
    <a target='_blank' href={`https://etherscan.io/tx/${record.hash}`} rel='noreferrer'>
      ES
    </a>
  );
};
