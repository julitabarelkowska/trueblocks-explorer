import * as ApiCallers from "../lib/api_callers";
import { blknum, PinnedChunk, Manifest } from "../types";

export function getChunks(
  parameters?: {
    blocks?: blknum[],
    check?: boolean,
    extract?: 'header' | 'addr_table' | 'app_table' | 'chunks' | 'blooms',
    stats?: boolean,
    save?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/chunks', method: 'get', parameters, options });
}
