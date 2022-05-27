import { blknum, timestamp, address, topic, bytes, Function } from "../types";

export type Log = {
  blockNumber: blknum
  transactionIndex: blknum
  logIndex: blknum
  timestamp: timestamp
  address: address
  topics: topic[]
  data: bytes
  articulatedLog: Function
  compressedLog: string
}
