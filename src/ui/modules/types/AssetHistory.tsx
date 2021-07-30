import { address, BalanceArray } from '@modules/types';

export declare type AssetHistory = {
  assetAddr: address;
  assetSymbol: string;
  balHistory: BalanceArray;
};
export declare type AssetHistoryArray = AssetHistory[];
