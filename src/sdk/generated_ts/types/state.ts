import { blknum, wei, uint64, bytes, address } from "../types";

export type State = {
  blockNumber: blknum
  balance: wei
  nonce: uint64
  code: bytes
  storage: bytes
  address: address
  deployed: blknum
  accttype: string
}
