import { ipfshash } from "../types";

export type PinnedChunk = {
  range: string
  bloomHash: ipfshash
  indexHash: ipfshash
}
