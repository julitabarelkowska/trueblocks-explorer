import { ipfshash, PinnedChunk } from "../types";

export type Manifest = {
  version: string
  chain: string
  schemas: ipfshash
  databases: ipfshash
  chunks: PinnedChunk[]
}
