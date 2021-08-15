import { addColumn, BaseTable } from '@components/Table';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import { ManifestRecord } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

export const IndexManifest = () => {
  const { theData, loading, status } = useFetchData('pins', { list: true });
  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch manifest',
    });
  }

  return <BaseTable dataSource={theData} columns={manifestSchema} loading={loading} />;
};

export const manifestSchema: ColumnsType<ManifestRecord> = [
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
