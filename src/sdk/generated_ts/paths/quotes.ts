import * as ApiCallers from "../lib/api_callers";
import { Quote } from "../types";

export function getQuotes(
  parameters?: {
    period?: 5 | 15 | 30 | 60 | 120 | 240 | 1440 | 10080 | 'hourly' | 'daily' | 'weekly',
    pair?: string,
    feed?: 'poloniex' | 'maker' | 'tellor',
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
  return ApiCallers.fetch<Quote[]>({ endpoint: '/quotes', method: 'get', parameters, options });
}
