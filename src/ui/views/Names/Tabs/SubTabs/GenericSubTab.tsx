import React from 'react';

import { Function, getAbis } from 'trueblocks-sdk';

import { ResourceTable } from '@components/ResourceTable';
import { useSdk } from '@hooks/useSdk';

import { useGlobalState } from '../../../../State';
import { abiSignature } from '../Signatures';

type GenericSubTabProps = {
  filterFunc: (item: Function) => boolean,
  resourceName: string,
};

// This component encapsulates all the similarities that Event and Function signatures tabs share
export function GenericSubTab({ filterFunc, resourceName }: GenericSubTabProps) {
  const { chain } = useGlobalState();
  const dataCall = useSdk(() => getAbis({
    chain: chain.chain,
    addrs: [],
    known: true,
    // verbose: 2,
  }));

  return (
    <ResourceTable
      resourceName={resourceName}
      call={dataCall}
      onData={(items: any) => items.filter(filterFunc)}
      columns={abiSignature}
    />
  );
}
