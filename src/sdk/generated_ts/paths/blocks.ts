import * as ApiCallers from "../lib/api_callers";
import { blknum, address, topic, Block } from "../types";

export function getBlocks(
  parameters?: {
    blocks: blknum[],
    hashes?: boolean,
    uncles?: boolean,
    trace?: boolean,
    apps?: boolean,
    uniq?: boolean,
    logs?: boolean,
    emitter?: address[],
    topic?: topic[],
    count?: boolean,
    cache?: boolean,
    list?: blknum,
    listCount?: blknum,
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
  return ApiCallers.fetch<Block[]>(
    {
      endpoint: '/blocks', method: 'get', parameters, options,
    },
  );
}
