import { useAcctStyles } from '../Accounts';
import { LogentryArray, Transaction } from '@modules/types';
import { Card } from 'antd';
import React from 'react';

//-----------------------------------------------------------------
export const AccountHistoryTraces = ({ record }: { record: Transaction }) => {
  if (!record) return <></>;
  const key = record.blockNumber + '.' + record.transactionIndex;
  const styles = useAcctStyles();
  return (
    <div key={key} className={styles.container}>
      <div key={key} className={styles.cardHolder}>
        <Card
          key={key}
          className={styles.card}
          headStyle={{
            backgroundColor: 'lightgrey',
          }}
          hoverable={true}
          title={'Events'}>
          {showLogs(record?.receipt?.logs)}
        </Card>
      </div>
    </div>
  );
};

//-----------------------------------------------------------------
const showLogs = (logs: LogentryArray) => {
  if (!logs) return <></>;
  return logs.map((log, index) => {
    return (
      <pre key={index}>
        [{index}]: {JSON.stringify(log, null, 2)}
      </pre>
    );
  });
};
