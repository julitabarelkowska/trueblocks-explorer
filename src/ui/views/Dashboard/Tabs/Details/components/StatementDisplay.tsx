import React from 'react';
import { createUseStyles } from 'react-jss';

import { Statement, Transaction } from 'trueblocks-sdk';

import { Statement12 } from './Statement';

export const StatementDisplay = ({ record }: { record: Transaction}) => {
  const style = useStyles();

  if (record.statements === null) return <></>;

  let item = record.compressedTx;
  if (item === '' && record.from === '0xPrefund') item = '0xPrefund';
  if (item === '' && record.from === '0xBlockReward') item = '0xBlockReward';
  if (item === '' && record.from === '0xUncleReward') item = '0xUncleReward';
  return (
    <div style={{ border: '1px solid darkgrey' }}>
      <div className={style.reconHead}>{item}</div>
      <div>
        <table>
          <tbody>
            {(record.statements as unknown as Statement[])?.map((statement, i) => (
              <Statement12
                key={`statement.assetAddr + ${i.toString()}`}
                statement={statement}
              />
            ))}
          </tbody>
        </table>
        {' '}

      </div>
    </div>
  );
};

const useStyles = createUseStyles({
  reconHead: {
    padding: '2px',
    paddingLeft: '5px',
    backgroundColor: 'lightgrey',
    color: '#222222',
    overflowX: 'hidden',
  },
});
