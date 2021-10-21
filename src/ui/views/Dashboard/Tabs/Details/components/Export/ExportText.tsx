import dayjs from 'dayjs';

import {
  TransactionArray,
} from '@modules/types';

import { sendTheExport } from '../../../../../../Utilities';

//-------------------------------------------------------------------------
export const exportToCsv = (theData: TransactionArray) => {
  sendTheExport('csv', convertForExport(theData, ','));
};

//-------------------------------------------------------------------------
export const exportToTxt = (theData: TransactionArray) => {
  sendTheExport('txt', convertForExport(theData, '\t'));
};

//-------------------------------------------------------------------------
const headers = [
  'blockNumber',
  'transactionIndex',
  'date',
  'time',
  'assetSymbol',
  'amountIn',
  'amountOut',
  'type',
  'assetAddr',
  'from',
  'to',
  'txHash',
];

//-------------------------------------------------------------------------
const incomeFields = [
  'amountIn',
  'internalIn',
  'selfDestructIn',
  'minerBaseRewardIn',
  'minerNephewRewardIn',
  'minerTxFeeIn',
  'minerUncleRewardIn',
  'prefundIn',
];

//-------------------------------------------------------------------------
const outflowFields = ['amountOut', 'internalOut', 'selfDestructOut', 'gasCostOut'];

//-------------------------------------------------------------------------
export const convertForExport = (theData: TransactionArray, delim: string) => {
  const sorted = theData;
  const txs = sorted.flatMap((trans: any) => trans.statements.flatMap((statement: any) => {
    const inflows = incomeFields
      .filter((field: any) => statement[field].length > 0)
      .map((field: string) => [
        trans.blockNumber,
        trans.transactionIndex,
        dayjs.unix(trans.timestamp).format('YYYY/MM/DD'),
        dayjs.unix(trans.timestamp).format('HH:mm:ss'),
        statement.assetSymbol,
        statement[field],
        '0.0000000',
        field,
        statement.assetAddr,
        trans.from,
        trans.to,
        trans.hash,
      ]);

    const outflows = outflowFields
      .filter((field: any) => statement[field].length > 0)
      .map((field: string) => [
        trans.blockNumber,
        trans.transactionIndex,
        dayjs.unix(trans.timestamp).format('YYYY/MM/DD'),
        dayjs.unix(trans.timestamp).format('HH:mm:ss'),
        statement.assetSymbol,
        '0.0000000',
        statement[field],
        field,
        statement.assetAddr,
        trans.from,
        trans.to,
        trans.hash,
      ]);

    return inflows.concat(outflows);
  }));
  txs.unshift(headers);
  return `${txs.map((row: any[]) => row.join(delim)).join('\n')}\n`;
};
