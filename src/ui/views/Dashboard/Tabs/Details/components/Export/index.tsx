import {
  TransactionArray,
} from '@modules/types';

import { sendTheExport } from '../../../../../../Utilities';

export * from './ExportOfx';
export * from './ExportText';

//-------------------------------------------------------------------------
export const exportToJson = (theData: TransactionArray) => {
  sendTheExport('json', JSON.stringify(theData, null, 2));
};
