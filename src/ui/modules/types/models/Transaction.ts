import { Name, Transaction } from 'trueblocks-sdk';

export type TransactionModel =
  Transaction
  & {
    id: string,
    fromName?: Name,
    toName?: Name,
    staging: boolean,
    chain: string,
  }
