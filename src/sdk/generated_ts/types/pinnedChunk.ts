import { ipfshash, blknum } from "../types";

export type PinnedChunk = {
  range: string
  bloomHash: ipfshash
  indexHash: ipfshash
  firstApp: blknum
  latestApp: blknum
}
