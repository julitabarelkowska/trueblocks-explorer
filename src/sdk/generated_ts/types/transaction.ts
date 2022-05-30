import { gas, hash, blknum, uint64, timestamp, address, wei, bytes, Receipt, Reconciliation, Function, date } from "../types";

export type Transaction = {
  gasPrice: gas
  hash: hash
  blockHash: hash
  blockNumber: blknum
  transactionIndex: blknum
  nonce: uint64
  timestamp: timestamp
  from: address
  to: address
  value: wei
  gas: gas
  input: bytes
  receipt: Receipt
  statements: Reconciliation[]
  articulatedTx: Function
  compressedTx: string
  hasToken: boolean
  finalized: boolean
  extraData: string
  isError: boolean
  date: date
}
