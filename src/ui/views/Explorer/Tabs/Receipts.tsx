import { Loading } from '@components/Loading';
import { useFetchData } from '@hooks/useFetchData';
import { createErrorNotification } from '@modules/error_notification';
import React from 'react';

export const Receipts = () => {
  const { theData, loading, status } = useFetchData('receipts', { transactions: '12001001.1', articulate: true });

  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch receipts',
    });
  }

  return (
    <Loading loading={loading}>
      <pre>{JSON.stringify(theData, null, 2)}</pre>
    </Loading>
  );
};
