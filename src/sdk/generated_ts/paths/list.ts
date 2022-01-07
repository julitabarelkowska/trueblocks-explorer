import * as ApiCallers from "../lib/api_callers";
import { address, Appearance, ListStats } from "../types";

export function getList(
  parameters?: {
    fmt?: 'json' | 'csv' | 'txt' | 'api',
    addrs: address[],
    count?: boolean,
    appearances?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Appearance[] | ListStats[]>({ endpoint: '/list', method: 'get', parameters, options });
}
