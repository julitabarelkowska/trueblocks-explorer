import { indexSchema } from '../Indexes';
import { BaseTable } from '@components/Table';
import React from 'react';

export const IndexTable = ({ theData, loading }: { theData: any[]; loading: boolean }) => {
  return <BaseTable dataSource={theData} columns={indexSchema} loading={loading} />;
};
