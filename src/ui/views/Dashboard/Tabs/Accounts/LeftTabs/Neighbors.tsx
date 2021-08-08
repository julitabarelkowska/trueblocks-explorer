import { TransactionArray } from '@modules/types';
import React from 'react';

export const Neighbors = ({
  theData,
  theMeta,
  loading,
}: {
  theData: TransactionArray;
  theMeta: any;
  loading: boolean;
}) => {
  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <div>Neighbors</div>
      <pre>{JSON.stringify(theMeta, null, 2)}</pre>
    </div>
  );
};
