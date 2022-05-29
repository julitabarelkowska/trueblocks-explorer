import * as ApiCallers from "../lib/api_callers";
import { blknum, address, PinnedChunk, Manifest } from "../types";

export function getChunks(
  parameters?: {
    mode: 'stats' | 'pins' | 'blooms' | 'index' | 'addresses' | 'appearances',
    blocks?: blknum[],
    addrs?: address[],
    check?: boolean,
    belongs?: boolean,
    chain: string,
    noHeader?: boolean,
    fmt?: string,
    verbose?: boolean,
    logLevel?: number,
    wei?: boolean,
    ether?: boolean,
    dollars?: boolean,
    raw?: boolean,
    toFile?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<PinnedChunk[] | Manifest[]>(
    {
      endpoint: '/chunks', method: 'get', parameters, options,
    },
  );
}
