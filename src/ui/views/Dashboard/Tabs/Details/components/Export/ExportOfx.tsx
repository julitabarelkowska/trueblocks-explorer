import dayjs from 'dayjs';
import Mustache from 'mustache';

// import Handlebars from 'handlebars';
import {
  TransactionArray,
} from '@modules/types';

import { sendTheExport } from '../../../../../../Utilities';
import { headers, incomeFields, outflowFields } from './ExportText';

//-------------------------------------------------------------------------
export const exportToOfx = (theData: TransactionArray) => {
  // let x = convertToOfx(theData);
  const timestamp = 1634781444;
  const transactions = {
    assetSymbol: 'Moe',
    transactions: [
      {
        amount: '-0.1',
        type: 'DEBIT',
        date: dayjs.unix(timestamp).format('YYYYMMDDHHmmss'),
        blockNum: 3001010,
        txId: 10,
        txHash: '0x1232432432423423432',
      },
      {
        amount: '0.1',
        type: 'CREDIT',
        date: dayjs.unix(timestamp).format('YYYYMMDDHHmmss'),
        blockNum: 8001010,
        txId: 2,
        txHash: '0x999991232432432423423432',
      },
    ],
  };

  const x = Mustache.render(templateString, transactions);
  sendTheExport('csv', x);
};

// const templateString = `{{#stooges}}
// <b>{{name}}</b>
// {{/stooges}}`;

const header = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:UTF-8
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE`;

//-------------------------------------------------------------------------
const templateString = `${header}

<OFX>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <TRNUID>2
      <STATUS>
        <CODE>0
        <SEVERITY>INFO
      </STATUS>
      <STMTRS>
      <CURDEF>USD
      <BANKACCTFROM>
        <BANKID>Crypto-Bankless
        <ACCTID>{{assetSymbol}}
        <ACCTTYPE>Cyrpto
      </BANKACCTFROM>

      <BANKTRANLIST>
        {{#transactions}}
        <STMTTRN>
          <FITID>{{id}}
          <TRNTYPE>{{type}}
          <TRNAMT>{{amount}}
          <MEMO>{{txIndex}}/{{field}}/{{assetAddr}}
          <DTPOSTED>{{date}}
        </STMTTRN>

        {{/transactions}}
      </BANKTRANLIST>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
`;

// //-------------------------------------------------------------------------
// const compiledTemplate = Handlebars.compile(templateString);

//-------------------------------------------------------------------------
export const convertToOfx = (theData: any) => {
  const sorted = theData;
  const transactions = sorted.flatMap((trans: any) => trans.statements.flatMap((statment: any) => {
    const date = dayjs.unix(statment.timestamp).format('YYYYMMDDHHmmss');
    const { assetAddr } = statment;
    const txHash = trans.hash;
    const txIndex = trans.transactionIndex;

    const inflows = incomeFields.map((field: any) => ({
      id: `${txHash}/${txIndex}/${field}`,
      type: 'CREDIT',
      amount: statment[field],
      date,
      assetAddr,
      txIndex,
      field,
    }));

    const outflows = outflowFields.map((field: any) => ({
      id: `${txHash}/${txIndex}/${field}`,
      type: 'DEBIT',
      amount: `-${statment[field]}`,
      date,
      assetAddr,
      txIndex,
      field,
    }));

    return inflows
      .concat(outflows)
      .filter(({ amount }) => amount.length > 0 && amount !== '-');
  }));

  transactions.unshift(headers);
  return `${transactions.map((row: any) => JSON.stringify(row, null, 2)).join('\n')}\n`;
  // const startDate = 'TODO';
  // const endDate = 'TODO';
  // return compiledTemplate({ startDate, endDate, transactions });
};
