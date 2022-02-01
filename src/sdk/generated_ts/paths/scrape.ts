import * as ApiCallers from "../lib/api_callers";
import { PinnedChunk, Manifest } from "../types";

export function getScrape(
  parameters?: {
    modes: string[],
    action?: 'toggle' | 'run' | 'restart' | 'pause' | 'quit',
    sleep?: number,
    pin?: boolean,
    publish?: boolean,
    blockCnt?: number,
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
  return ApiCallers.fetch<PinnedChunk[] | Manifest[]>({ endpoint: '/scrape', method: 'get', parameters, options });
}
