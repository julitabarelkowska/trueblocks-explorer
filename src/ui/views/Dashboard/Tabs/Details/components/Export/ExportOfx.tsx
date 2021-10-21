import {
  TransactionArray,
} from '@modules/types';

import { exportToCsv } from './ExportText';

//-------------------------------------------------------------------------
export const exportToOfx = (theData: TransactionArray) => {
  exportToCsv(theData);
};
