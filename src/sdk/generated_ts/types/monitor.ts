import { blknum, uint64, address } from "../types";

export type Monitor = {
  nApps: blknum
  firstApp: blknum
  latestApp: blknum
  sizeInBytes: uint64
  tags: string
  address: address
  isCustom: boolean
  name: string
  symbol: string
  source: string
  decimals: number
  isContract: boolean
  isValid: boolean
}
