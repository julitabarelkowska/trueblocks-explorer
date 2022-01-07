import * as ApiCallers from "../lib/api_callers";
import { DatedBlock } from "../types";

export function getWhen(
  parameters?: {
    fmt?: 'json' | 'csv' | 'txt' | 'api',
    timestamps?: boolean,
    list?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<DatedBlock[]>({ endpoint: '/when', method: 'get', parameters, options });
}
