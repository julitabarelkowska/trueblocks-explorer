import * as ApiCallers from "../lib/api_callers";
import { address, Function } from "../types";

export function getAbis(
  parameters?: {
    fmt?: 'json' | 'csv' | 'txt' | 'api',
    addrs: address[],
    sol?: boolean,
    find?: string[],
    known?: boolean,
    source?: boolean,
    logLevel?: number,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Function[]>({ endpoint: '/abis', method: 'get', parameters, options });
}
