import { Transaction, TransactionArray } from '@modules/types';
import React from 'react';

export const Gas = ({ theData, loading }: { theData: TransactionArray; loading: boolean }) => {
  if (!theData) return <></>;
  const usesGas = theData.filter((tx: Transaction, index: number) => {
    if (!tx.statements) return false;
    const stmts = tx.statements.filter((st) => {
      // console.log('---------', index, '---------', index < 3, '---------');
      return st.gasCostOut !== '';
    });
    return stmts.length > 0;
  });

  let stmts = usesGas.map((tx: Transaction) => {
    return tx.statements.map((st) => {
      return {
        blockNumber: tx.blockNumber,
        transactionIndex: tx.transactionIndex,
        hash: tx.hash,
        from: tx.from,
        fromName: tx.fromName.name,
        to: tx.to,
        toName: tx.toName.name,
        isError: tx.isError,
        asset: st.assetSymbol,
        gasCostOut: st.gasCostOut,
      };
    });
  });

  stmts = stmts.filter((st: any) => {
    return st.gasCostOut !== '';
  });

  return (
    <div>
      <div style={{ width: '30%', backgroundColor: 'orange', color: 'black' }}>This module is not completed.</div>
      <pre>len: {usesGas.length}</pre>
      <pre>{JSON.stringify(stmts, null, 2)}</pre>
    </div>
  );
};
