import React from 'react';

import { BaseTable } from '@components/Table';

import { indexSchema } from '../Indexes';

export const IndexTable = ({
  theData,
  title,
  loading,
}: {
  theData: any[];
  title: string | JSX.Element;
  loading: boolean;
}) => (
  <>
    {title}
    <BaseTable dataSource={theData} columns={indexSchema} loading={loading} />
  </>
);
