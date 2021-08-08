import { int256 } from '@modules/types';

export declare type Balance = {
  date: Date;
  balance: int256;
  reconciled: boolean;
};
export declare type BalanceArray = Balance[];
