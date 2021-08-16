import { indexSchema } from '../Indexes';
import { GridTable } from '@components/GridTable';
import React from 'react';

export const IndexGrid = ({ theData, loading }: { theData: any[]; loading: boolean }) => {
  return <GridTable data={theData} columns={indexSchema} />;
};
