import { blknum, uint64, address } from "../types";

export type Monitor = {
  nApps: blknum
  firstApp: blknum
  latestApp: blknum
  sizeInBytes: uint64
  tags: string
  address: address
  name: string
  isCustom: boolean
  deleted: boolean
  symbol: string
  source: string
  decimals: uint64
  isContract: boolean
}
