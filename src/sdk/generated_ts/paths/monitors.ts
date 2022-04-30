import * as ApiCallers from "../lib/api_callers";
import { address, Monitor } from "../types";

export function getMonitors(
  parameters?: {
    addrs: address[],
    clean?: boolean,
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
  return ApiCallers.fetch<Monitor[]>(
    {
      endpoint: '/monitors', method: 'get', parameters, options,
    },
  );
}
export function deleteMonitors(
  parameters?: {
    addrs: address[],
    delete?: boolean,
    undelete?: boolean,
    remove?: boolean,
    chain: string,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<never>(
    {
      endpoint: '/monitors', method: 'delete', parameters, options,
    },
  );
}
