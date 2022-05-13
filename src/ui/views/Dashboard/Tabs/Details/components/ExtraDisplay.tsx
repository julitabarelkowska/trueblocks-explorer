import React from 'react';

import {
  Transaction,
} from '@sdk';

import { useGlobalState } from '../../../../../State';

export const ExtraDisplay = ({ record }: { record: Transaction}) => {
  const { chain } = useGlobalState();
  const url = new URL(
    `/tx/${record.hash}`,
    chain.remoteExplorer,
  );

  return (
    <a target='_blank' href={url.toString()} rel='noreferrer'>
      ES
    </a>
  );
};
