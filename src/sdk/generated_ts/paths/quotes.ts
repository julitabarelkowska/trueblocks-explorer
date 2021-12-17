import * as ApiCallers from "../lib/api_callers";
import { Quote } from "../types";

export function getQuotes(
  parameters?: {
    fmt?: 'json' | 'csv' | 'txt' | 'api',
    period?: 5 | 15 | 30 | 60 | 120 | 240 | 1440 | 10080 | 'hourly' | 'daily' | 'weekly',
    pair?: string,
    feed?: 'poloniex' | 'maker' | 'tellor',
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Quote[]>({ endpoint: '/quotes', method: 'get', parameters, options });
}
