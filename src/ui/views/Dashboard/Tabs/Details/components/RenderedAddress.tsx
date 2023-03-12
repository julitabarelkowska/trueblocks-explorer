import React from 'react';

import { TransactionModel } from '@modules/types/models/Transaction';

export const RenderedAddress = ({ record, which }: {record: TransactionModel, which: string}) => {
  let address = which === 'from' ? record.from : record.to;
  const isCreation = address === '0x0';
  if (isCreation && record.receipt.contractAddress !== undefined) {
    address = record.receipt.contractAddress; // may be empty
  }
  const isSpecial = address === '0xPrefund' || address === '0xBlockReward' || address === '0xUncleReward';

  const acctFor = record.extraData;
  const isCurrent = address === acctFor;

  const nameSource = which === 'from' ? 'fromName' : 'toName';
  let name = record[nameSource]?.name;
  if (!isSpecial && !isCurrent && !name) {
    return <div style={{ color: 'grey' }}>{address}</div>;
  }

  let style = isCurrent ? { color: 'blue' } : { color: 'green' };
  if (isSpecial) {
    name = undefined;
    style = { color: 'green' };
  }

  const decorated = !name
    ? address
    : `[${address?.substr(0, 6)}...${address?.substr(address.length - 4, address.length)}] `;
  const addr = (isCreation ? '0x0 --> ' : '') + decorated;

  return (
    <div style={style}>
      {addr}
      {name}
    </div>
  );
};
