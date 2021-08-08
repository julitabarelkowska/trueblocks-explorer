import { AccountViewParams } from '../../../Dashboard';
import { useAcctStyles } from '../Accounts';
import { Reconciliation, Transaction } from '@modules/types';
import { Card } from 'antd';
import React from 'react';

//-----------------------------------------------------------------
export const HistoryRecons = ({ record, params }: { record: Transaction; params: AccountViewParams }) => {
  const { prefs } = params;

  if (!record) return <></>;
  const key = record.blockNumber + '.' + record.transactionIndex;
  const styles = useAcctStyles();
  return (
    <div key={key} className={styles.container}>
      <div key={key} className={styles.cardHolder}>
        {record?.statements?.map((statement: Reconciliation, index: number) =>
          oneStatement(statement, index, prefs.expandRecons, prefs.setExpandRecons, styles, key)
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
  expandRecons: boolean,
  setExpandRecons: any,
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
      title={statementHeader(statement, expandRecons, setExpandRecons)}>
      {statementBody(statement, expandRecons, styles)}
    </Card>
  );
};

//-----------------------------------------------------------------
const statementHeader = (statement: Reconciliation, expandRecons: boolean, setExpandRecons: any) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20fr 1fr', textAlign: 'start' }}>
      <div>
        {statement.assetSymbol + ' reconciliation'} [{statement.reconciliationType}]
      </div>
      <div onClick={() => setExpandRecons(!expandRecons)}>{expandRecons ? '-' : '+'}</div>
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
const statementBody = (statement: Reconciliation, expandRecons: boolean, styles: any) => {
  return (
    <table>
      <tbody>
        {oneRow(styles, expandRecons, '', 'income', 'outflow', 'balance', 'diff', true)}
        {oneRow(
          styles,
          expandRecons,
          'begBal',
          '',
          '',
          statement.begBal === '' ? '0.0000000' : statement.begBal,
          statement.begBalDiff
        )}
        {oneRow(styles, expandRecons, 'amount', statement.amountIn, statement.amountOut)}
        {oneRow(styles, expandRecons, 'internal', statement.internalIn, statement.internalOut)}
        {oneRow(styles, expandRecons, 'selfDestruct', statement.selfDestructIn, statement.selfDestructOut)}
        {oneRow(styles, expandRecons, 'minerBaseReward', statement.minerBaseRewardIn)}
        {oneRow(styles, expandRecons, 'minerNephewReward', statement.minerNephewRewardIn)}
        {oneRow(styles, expandRecons, 'minerTxFee', statement.minerTxFeeIn)}
        {oneRow(styles, expandRecons, 'minerUncleReward', statement.minerUncleRewardIn)}
        {oneRow(styles, expandRecons, 'prefund', statement.prefundIn)}
        {oneRow(styles, expandRecons, 'gasCost', '', statement.gasCostOut)}
        {oneRow(
          styles,
          expandRecons,
          'amountNet',
          '',
          '',
          statement.amountNet === '' ? '' : statement.amountNet > '0' ? '+' + statement.amountNet : statement.amountNet
        )}
        {oneRow(
          styles,
          expandRecons,
          'endBal',
          '',
          '',
          statement.endBal === '' ? '0.0000000' : statement.endBal,
          statement.endBalDiff
        )}
        {oneDivider(styles, expandRecons)}
        {oneDebug(styles, expandRecons, 'assetAddr', statement.assetAddr)}
        {oneDebug(styles, expandRecons, 'assetSymbol', statement.assetSymbol)}
        {oneDebug(styles, expandRecons, 'decimals', statement.decimals.toString())}
        {oneDebug(styles, expandRecons, 'blockNumber', statement.blockNumber.toString())}
        {oneDebug(styles, expandRecons, 'transactionIndex', statement.transactionIndex.toString())}
        {oneDebug(styles, expandRecons, 'timestamp', statement.timestamp.toString())}
        {oneDebug(styles, expandRecons, 'prevBlk', statement.prevBlk.toString())}
        {oneDivider(styles, expandRecons)}
        {oneDebug(styles, expandRecons, 'type', statement.reconciliationType)}
        {oneDebug(styles, expandRecons, 'prevBlkBal', statement.prevBlkBal)}
        {oneDebug(styles, expandRecons, 'begBal', statement.begBal)}
        {oneDebug(styles, expandRecons, 'begBalDiff', statement.begBalDiff, true)}
        {oneDebug(styles, expandRecons, 'endBal', statement.endBal)}
        {oneDebug(styles, expandRecons, 'endBalCalc', statement.endBalCalc)}
        {oneDebug(styles, expandRecons, 'endBalDiff', statement.endBalDiff, true)}
        {/* {oneRow(styles, expandRecons, 'reconciled', statement.reconciled ? 'true' : 'false')} */}
      </tbody>
    </table>
  );
};

//-----------------------------------------------------------------
const oneDivider = (styles: any, expandRecons: boolean) => {
  if (!expandRecons) return <></>;
  return (
    <tr>
      <td className={styles.tableRow} colSpan={6}>
        <hr />
      </td>
    </tr>
  );
};

//-----------------------------------------------------------------
const oneDebug = (styles: any, expandRecons: boolean, name: string, value: string, second?: boolean) => {
  if (!expandRecons) return <></>;
  let isErr: boolean = false;
  if (value === '') {
    value = '0.0000000';
    isErr = true;
  }
  let disp = (
    <tr>
      <td className={styles.tableRow} style={{ width: '100px' }}>
        {name}
      </td>
      <td className={styles.tableRow} style={{ width: '20px' }}>
        {' '}
      </td>
      <td className={styles.tableRow} style={{ textAlign: 'left' }} colSpan={4}>
        {value}
      </td>
    </tr>
  );
  if (second) {
    disp = (
      <tr>
        <td className={styles.tableRow} style={{ width: '100px' }}>
          {name}
        </td>
        <td className={styles.tableRow} style={{ width: '20px' }}>
          {' '}
        </td>
        <td className={styles.tableRow} style={{ textAlign: 'left' }}>
          {' '}
        </td>
        <td
          className={styles.tableRow}
          style={isErr ? { textAlign: 'left' } : { color: 'red', textAlign: 'left' }}
          colSpan={3}>
          {value}
        </td>
      </tr>
    );
  }
  return disp;
};

//-----------------------------------------------------------------
const oneRow = (
  styles: any,
  expandRecons: boolean,
  name: string,
  valueIn: string,
  valueOut: string = '',
  balance: string = '',
  diffIn: string = '',
  header: boolean = false
) => {
  const v1: number = +valueIn;
  const v2: number = +valueOut;
  if (!expandRecons && name !== 'begBal' && name !== 'endBal' && v1 + v2 === 0) return <></>;

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
