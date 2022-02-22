import React from 'react';

import { CopyTwoTone } from '@ant-design/icons';
import { Log, Transaction } from '@sdk';
import { useGlobalNames } from '@state';
import { Button, Card } from 'antd';

import { Address } from '@components/Address';
import { DataDisplay } from '@components/DataDisplay';
import { OnValue } from '@modules/tree';

import { headerStyle, useAcctStyles } from '..';
// import { FunctionDisplay } from '../components/FunctionDisplay';

//-----------------------------------------------------------------
export const HistoryEvents = ({ record }: { record: Transaction }) => {
  const styles = useAcctStyles();

  const key = `${record.blockNumber}.${record.transactionIndex}`;
  const { namesMap } = useGlobalNames();

  let title = '[no logs]';
  if (record.receipt && record.receipt.logs && record.receipt.logs.length > 0) {
    let titles = record.receipt.logs.map((log) => {
      const hasAddress = Boolean(log.address);
      if (hasAddress) {
        const n = namesMap.get(log.address);
        const name = n ? ` from ${n.name}` : ` from ${log.address.slice(0, 6)}`;
        if (log.articulatedLog) {
          return `${log.articulatedLog.name}${name}`;
        }
        return `[unknown]${name}`;
      }
      return '';
    });
    titles = titles?.filter((log) => log !== '');
    if (titles.length !== 0) {
      title = titles.join(', ');
    } else {
      title = '[no relevant logs]';
    }
  }

  const relevants = record.receipt?.logs?.map((log) => {
    const hasAddress = Boolean(log.address);
    if (!hasAddress) return null;
    return <RelevantLog key={log.logIndex} log={log} />;
  });

  const irrelevants = record.receipt?.logs?.map((log, index) => {
    const hasAddress = Boolean(log.address);
    if (hasAddress) return null;
    if (!Object.keys(log).length) return null;
    return <IrrelevantLog key={log.logIndex} index={index} />;
  });

  return (
    <div key={key} className={styles.container}>
      <div className={styles.cardHolder}>
        <Card
          className={styles.card}
          headStyle={headerStyle}
          hoverable
          title={(
            <span style={{ whiteSpace: 'break-spaces' }}>
              {title}
            </span>
          )}
        >
          {relevants}
          {irrelevants}
        </Card>
      </div>
    </div>
  );
};

//-----------------------------------------------------------------
const onValue: OnValue = (path, value) => {
  if (path[0] === 'address') {
    return <Address address={String(value)} />;
  }

  if ((path[0] === 'articulatedLog' && path[1] === 'inputs') && (path[2] === '_from' || path[2] === '_to')) {
    return <Address address={String(value)} />;
  }

  if (path[0] === 'compressedLog') {
    return (
      <>
        <code>{value}</code>
        <Button
          onClick={() => navigator.clipboard.writeText(String(value))}
          icon={<CopyTwoTone />}
        >
          Copy
        </Button>
      </>
    );
  }

  return <>{value}</>;
};

const RelevantLog = ({ log }: { log: Log }) => (
  <DataDisplay data={log} onValue={onValue} />
);

//-----------------------------------------------------------------
const IrrelevantLog = ({ index } : {index: number}) => {
  const s = `${index}`.padStart(4);
  return (
    <div key={s} style={{ fontStyle: 'italic', color: 'darkgrey' }}>
      {`[log ${s}] is irrelevant`}
    </div>
  );
};
