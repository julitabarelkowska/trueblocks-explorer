import { blknum, address, wei, uint64, bytes } from "../types";

export type State = {
  blockNumber: blknum
  address: address
  proxy: address
  balance: wei
  nonce: uint64
  code: bytes
  deployed: blknum
  accttype: string
}
