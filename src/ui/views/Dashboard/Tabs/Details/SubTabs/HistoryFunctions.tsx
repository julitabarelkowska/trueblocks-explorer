import React from 'react';

import { Card } from 'antd';
import { Transaction } from 'trueblocks-sdk';

import { headerStyle, useAcctStyles } from '..';
import { FunctionDisplay } from '../components/FunctionDisplay';

//-----------------------------------------------------------------
export const HistoryFunctions = ({ record }: { record: Transaction }) => {
  const styles = useAcctStyles();

  if (!record) return <></>;
  const key = `${record.blockNumber}.${record.transactionIndex}`;

  let title = record.articulatedTx?.name;
  if (!title) { title = (record.input !== '0x' ? '[unknown]' : '[native send]'); }

  return (
    <div key={key} className={styles.container}>
      <div className={styles.cardHolder}>
        <Card
          className={styles.card}
          headStyle={headerStyle}
          hoverable
          title={title}
        >
          <FunctionDisplay func={record.articulatedTx} rawBytes={record.input} />
        </Card>
      </div>
    </div>
  );
};
