import * as ApiCallers from "../lib/api_callers";
import { address, Monitor } from "../types";

export function getMonitors(
  parameters?: {
    fmt?: 'json' | 'csv' | 'txt' | 'api',
    addrs: address[],
    appearances?: boolean,
    count?: boolean,
    clean?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Monitor[]>({ endpoint: '/monitors', method: 'get', parameters, options });
}
