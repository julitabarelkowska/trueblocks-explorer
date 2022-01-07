import { blknum, address, topic, bytes, ArticulatedLog, timestamp } from "../types";

export type Log = {
  blockNumber: blknum
  transactionIndex: blknum
  address: address
  logIndex: blknum
  topics: topic[]
  data: bytes
  articulatedLog: ArticulatedLog
  compressedLog: string
  timestamp: timestamp
}
