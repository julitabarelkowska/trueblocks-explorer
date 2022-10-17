import { hash, blknum, timestamp, uint64, TraceAction, TraceResult, Function } from "../types";

export type Trace = {
  blockHash: hash
  blockNumber: blknum
  timestamp: timestamp
  transactionHash: hash
  transactionIndex: blknum
  traceAddress: string[]
  subtraces: uint64
  type: string
  action: TraceAction
  result: TraceResult
  articulatedTrace: Function
  compressedTrace: string
}
