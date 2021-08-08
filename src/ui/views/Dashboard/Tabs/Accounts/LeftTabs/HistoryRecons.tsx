import { useAcctStyles } from '../Accounts';
import { Reconciliation, Transaction } from '@modules/types';
import { Card } from 'antd';
import React, { useState } from 'react';

//-----------------------------------------------------------------
export const HistoryRecons = ({ record }: { record: Transaction }) => {
  if (!record) return <></>;
  const [expand, setExpand] = useState(false);
  const key = record.blockNumber + '.' + record.transactionIndex;
  const styles = useAcctStyles();
  return (
    <div key={key} className={styles.container}>
      <div key={key} className={styles.cardHolder}>
        {record?.statements?.map((statement: Reconciliation, index: number) =>
          oneStatement(statement, index, expand, setExpand, styles, key)
        )}
      </div>
      <div></div>
    </div>
  );
};

//-----------------------------------------------------------------
const oneStatement = (
  statement: Reconciliation,
  index: number,
  expand: boolean,
  setExpand: React.Dispatch<React.SetStateAction<boolean>>,
  styles: any,
  key: string
) => {
  return (
    <Card
      key={key + '.' + index}
      className={styles.card}
      headStyle={{
        backgroundColor: 'lightgrey',
      }}
      hoverable={true}
      title={statementHeader(statement, expand, setExpand)}>
      {statementBody(statement, expand, styles)}
    </Card>
  );
};

//-----------------------------------------------------------------
const statementHeader = (
  statement: Reconciliation,
  expand: boolean,
  setExpand: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20fr 1fr', textAlign: 'start' }}>
      <div>
        {statement.assetSymbol + ' reconciliation'} [{statement.reconciliationType}]
      </div>
      <div onClick={() => setExpand(!expand)}>{expand ? '-' : '+'}</div>
    </div>
  );
};

//-----------------------------------------------------------------
const clip = (num: string, diff?: boolean) => {
  const parts = num.split('.');
  if (parts.length === 0 || parts[0] === '') return <div style={{ color: 'lightgrey' }}>{'-'}</div>;
  if (parts.length === 1)
    return (
      <div style={diff ? { color: 'red' } : {}}>
        {parts[0]}
        {'.0000000'}
      </div>
    );
  return <div style={diff ? { color: 'red' } : {}}>{parts[0] + '.' + parts[1].substr(0, 7)}</div>;
};

//-----------------------------------------------------------------
const statementBody = (statement: Reconciliation, expand: boolean, styles: any) => {
  return (
    <table>
      <tbody>
        {oneRow(styles, expand, '', 'income', 'outflow', 'balance', 'diff', true)}
        {oneRow(
          styles,
          expand,
          'begBal',
          '',
          '',
          statement.begBal === '' ? '0.0000000' : statement.begBal,
          statement.begBalDiff
        )}
        {oneRow(styles, expand, 'amount', statement.amountIn, statement.amountOut)}
        {oneRow(styles, expand, 'internal', statement.internalIn, statement.internalOut)}
        {oneRow(styles, expand, 'selfDestruct', statement.selfDestructIn, statement.selfDestructOut)}
        {oneRow(styles, expand, 'minerBaseReward', statement.minerBaseRewardIn)}
        {oneRow(styles, expand, 'minerNephewReward', statement.minerNephewRewardIn)}
        {oneRow(styles, expand, 'minerTxFee', statement.minerTxFeeIn)}
        {oneRow(styles, expand, 'minerUncleReward', statement.minerUncleRewardIn)}
        {oneRow(styles, expand, 'prefund', statement.prefundIn)}
        {oneRow(styles, expand, 'gasCost', '', statement.gasCostOut)}
        {oneRow(
          styles,
          expand,
          'amountNet',
          '',
          '',
          statement.amountNet === '' ? '' : statement.amountNet > '0' ? '+' + statement.amountNet : statement.amountNet
        )}
        {oneRow(
          styles,
          expand,
          'endBal',
          '',
          '',
          statement.endBal === '' ? '0.0000000' : statement.endBal,
          statement.endBalDiff
        )}
        {oneDiv(styles, expand)}
        {oneRow(styles, expand, 'blockNumber', '', '', statement.blockNumber.toString() + '.')}
        {oneRow(styles, expand, 'transactionIndex', '', '', statement.transactionIndex.toString() + '.')}
        {oneRow(styles, expand, 'timestamp', '', '', statement.timestamp.toString() + '.')}
        {/* {oneRow(styles, expand, 'assetAddr', '', '', statement.assetAddr + '.')} */}
        {oneRow(styles, expand, 'assetSymbol', '', '', statement.assetSymbol + '.')}
        {oneRow(styles, expand, 'decimals', '', '', statement.decimals.toString() + '.')}
        {oneRow(styles, expand, 'prevBlk', '', '', statement.prevBlk + '.')}
        {oneRow(styles, expand, 'prevBlkBal', '', '', statement.prevBlkBal + '.')}
        {oneRow(styles, expand, 'endBalCalc', '', '', statement.endBalCalc + '.')}
        {oneRow(styles, expand, 'type', '', '', statement.reconciliationType + '.')}
        {/* {oneRow(styles, expand, 'reconciled', '', '', statement.reconciled ? 'true' : 'false') + '.'} */}
      </tbody>
    </table>
  );
};

//-----------------------------------------------------------------
const oneDiv = (styles: any, expand: boolean) => {
  if (!expand) return <></>;
  return (
    <tr>
      <td className={styles.tableRow} style={{ width: '100px' }} colSpan={6}>
        <hr />
      </td>
    </tr>
  );
};

//-----------------------------------------------------------------
const oneRow = (
  styles: any,
  expand: boolean,
  name: string,
  valueIn: string,
  valueOut: string = '',
  balance: string = '',
  diffIn: string = '',
  header: boolean = false
) => {
  const v1: number = +valueIn;
  const v2: number = +valueOut;
  if (!expand && name !== 'begBal' && name !== 'endBal' && v1 + v2 === 0) return <></>;

  const valI = header ? valueIn : clip(valueIn);
  const valO = header ? valueOut : clip(valueOut);
  const bal = header ? balance : clip(balance);
  const diff = header ? diffIn : clip(diffIn, true);
  const style = header ? styles.tableHead : styles.tableRow;
  const dStyle = diffIn !== '' ? {} : { color: 'red' };

  return (
    <tr>
      <td className={style} style={{ width: '100px' }}>
        {name}
      </td>
      <td className={style} style={{ width: '20px' }}>
        {' '}
      </td>
      <td className={style} style={{ width: '100px' }}>
        {valI}
      </td>
      <td className={style} style={{ width: '100px' }}>
        {valO}
      </td>
      <td className={style} style={{ width: '100px' }}>
        {bal}
      </td>
      <td className={style} style={{ ...dStyle, width: '100px' }}>
        {diff}
      </td>
    </tr>
  );
};
