import dayjs from 'dayjs';

// import Handlebars from 'handlebars';
import {
  TransactionArray,
} from '@modules/types';

import { sendTheExport } from '../../../../../../Utilities';
import { incomeFields, outflowFields } from './ExportText';

//-------------------------------------------------------------------------
export const exportToOfx = (theData: TransactionArray) => {
  sendTheExport('ofx', 'Junk'); // convertToOfx(theData));
};

// //-------------------------------------------------------------------------
// const templateString = `
// OFXHEADER:100
// DATA:OFXSGML
// VERSION:102
// SECURITY:NONE
// ENCODING:UTF-8
// CHARSET:1252
// COMPRESSION:NONE
// OLDFILEUID:NONE
// NEWFILEUID:NONE

// {{name}}
// <OFX>
//   <BANKMSGSRSV1>
//     <STMTTRNRS>
//       <TRNUID>2
//       <STATUS>
//         <CODE>0
//         <SEVERITY>INFO
//       </STATUS>
//       <STMTRS>
//       <CURDEF>USD
//       <BANKACCTFROM>
//         <BANKID>account-id
//         <ACCTID>00001
//         <ACCTTYPE>crypto
//       </BANKACCTFROM>

//       <BANKTRANLIST>
//         {{#transactions}}
//         <STMTTRN>
//           <FITID>{{id}}
//           <TRNTYPE>{{type}}
//           <TRNAMT>{{amount}}
//           <MEMO>{{txIndex}}/{{field}}/{{assetAddr}}
//           <DTPOSTED>{{date}}
//         </STMTTRN>

//         {{/transactions}}
//       </BANKTRANLIST>
//     </STMTTRNRS>
//   </BANKMSGSRSV1>
// </OFX>
// `;

// //-------------------------------------------------------------------------
// const compiledTemplate = Handlebars.compile(templateString);

// //-------------------------------------------------------------------------
// export const convertToOfx = (theData: any) => {
//   const sorted = theData;
//   const transactions = sorted.flatMap((trans: any) => trans.statements.flatMap((statment: any) => {
//     const date = dayjs.unix(statment.timestamp).format('YYYYMMDDHHmmss');
//     const { assetAddr } = statment;
//     const txHash = trans.hash;
//     const txIndex = trans.transactionIndex;

//     const inStatements = incomeFields.map((field: any) => ({
//       id: `${txHash}/${txIndex}/${field}`,
//       type: 'CREDIT',
//       amount: statment[field],
//       date,
//       assetAddr,
//       txIndex,
//       field,
//     }));

//     const outStatements = outflowFields.map((field: any) => ({
//       id: `${txHash}/${txIndex}/${field}`,
//       type: 'DEBIT',
//       amount: `-${statment[field]}`,
//       date,
//       assetAddr,
//       txIndex,
//       field,
//     }));

//     return inStatements
//       .concat(outStatements)
//       .filter(({ amount }) => amount.length > 0);
//   }));
//   const startDate = 'TODO';
//   const endDate = 'TODO';
//   return compiledTemplate({ startDate, endDate, transactions });
// };
