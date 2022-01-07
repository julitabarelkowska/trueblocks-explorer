import * as ApiCallers from "../lib/api_callers";
import { tx_id, Transaction } from "../types";

export function getTransactions(
  parameters?: {
    fmt?: 'json' | 'csv' | 'txt' | 'api',
    transactions: tx_id[],
    articulate?: boolean,
    trace?: boolean,
    uniq?: boolean,
    reconcile?: string,
    cache?: boolean,
  },
  options?: RequestInit,
) {
  return ApiCallers.fetch<Transaction[]>({ endpoint: '/transactions', method: 'get', parameters, options });
}
