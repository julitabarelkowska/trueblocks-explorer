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
  let neighbors: any = [];
  theData.map((item) => {
    neighbors.push({
      key: item.from + '-from',
      count: 1,
    });
    neighbors.push({
      key: item.to + '-to',
      count: 1,
    });
  });

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <div>Neighbors</div>
      <pre>{JSON.stringify(neighbors, null, 2)}</pre>
    </div>
  );
};
