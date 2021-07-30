import { addColumn, BaseTable } from '@components/Table';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

export const IndexManifest = () => {
  const { theData, loading, status } = useFetchData('pins', { list: true });

  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch manifest',
    });
  }

  return (
    <div style={{ width: '70%' }}>
      <BaseTable dataSource={theData} columns={manifestSchema} loading={false} />
    </div>
  );
};

declare type ManifestRecord = {
  fileName: string;
  bloomHash: string;
  indexHash: string;
};

export const manifestSchema: ColumnsType<ManifestRecord> = [
  addColumn({
    title: 'File Name',
    dataIndex: 'fileName',
    configuration: {
      width: '200px',
      render: (value) => <pre>{value}</pre>,
    },
  }),
  addColumn({
    title: 'Bloom Hash',
    dataIndex: 'bloomHash',
    configuration: {
      render: (value) => <pre>{value}</pre>,
    },
  }),
  addColumn({
    title: 'Index Hash',
    dataIndex: 'indexHash',
    configuration: {
      render: (value) => <pre>{value}</pre>,
    },
  }),
];
