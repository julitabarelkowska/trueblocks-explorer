import * as ApiCallers from "../lib/api_callers";
import { blknum, DatedBlock } from "../types";

export function getWhen(
  parameters?: {
    blocks?: blknum[],
    timestamps?: boolean,
    list?: boolean,
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
  return ApiCallers.fetch<DatedBlock[]>(
    {
      endpoint: '/when', method: 'get', parameters, options,
    },
  );
}
