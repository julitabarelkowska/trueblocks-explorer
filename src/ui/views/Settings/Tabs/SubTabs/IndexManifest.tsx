import React from 'react';

import { ColumnsType } from 'antd/lib/table';
import { getChunks, Manifest } from 'trueblocks-sdk';

import { ResourceTable } from '@components/ResourceTable';
import { addColumn } from '@components/Table';
import { useSdk } from '@hooks/useSdk';

import { useGlobalState } from '../../../../State';

export const IndexManifest = () => {
  const { chain } = useGlobalState();

  const pinsCall = useSdk(() => getChunks({
    chain: chain.chain,
    mode: 'index',
  }));

  return (
    <ResourceTable
      resourceName='manifest'
      call={pinsCall}
      columns={manifestSchema}
    />
  );
};

export const manifestSchema: ColumnsType<Manifest> = [
  addColumn({
    title: 'File Name',
    dataIndex: 'fileName',
    configuration: {
      width: '200px',
    },
  }),
  addColumn({
    title: 'Bloom Hash',
    dataIndex: 'bloomHash',
  }),
  addColumn({
    title: 'Index Hash',
    dataIndex: 'indexHash',
  }),
];
