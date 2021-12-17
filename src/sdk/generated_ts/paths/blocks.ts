import * as ApiCallers from "../lib/api_callers";
import { blknum, address, topic, Block } from "../types";

export function getBlocks(
  parameters?: {
    fmt?: 'json' | 'csv' | 'txt' | 'api',
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
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Block[]>({ endpoint: '/blocks', method: 'get', parameters, options });
}
