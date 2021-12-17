import { ipfshash, blknum } from "../types";

export type PinnedChunk = {
  fileName: string
  bloomHash: ipfshash
  indexHash: ipfshash
  firstApp: blknum
  latestApp: blknum
}
