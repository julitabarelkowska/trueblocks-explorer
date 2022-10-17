import { blknum, hash, timestamp, address, topic, bytes, Function } from "../types";

export type Log = {
  blockNumber: blknum
  transactionIndex: blknum
  logIndex: blknum
  transactionHash: hash
  timestamp: timestamp
  address: address
  topics: topic[]
  data: bytes
  articulatedLog: Function
  compressedLog: string
}
