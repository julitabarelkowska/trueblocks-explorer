import {
  address as Address, AnyResponse, getExport, getList, ListStats, Transaction,
} from '@sdk';

import { isFailedCall, wrapResponse } from '@modules/api/call_status';

async function fetchTransactions(chain: string, addresses: Address[], loaded: number) {
  const response = wrapResponse((await getExport({
    chain,
    addrs: addresses,
    fmt: 'json',
    cache: true,
    cacheTraces: true,
    staging: false, // showStaging,
    // unripe: showUnripe,
    ether: true,
    // dollars: false,
    articulate: true,
    accounting: true,
    // reversed: false,
    relevant: true,
    // summarize_by: 'monthly',
    firstRecord: loaded,
    maxRecords: (() => {
      if (loaded < 20) return 10;
      if (loaded < 800) return 239;
      return 639; /* an arbitrary number not too big, not too small, that appears not to repeat */
    })(),
  }) as AnyResponse<Transaction[]>));

  if (isFailedCall(response)) {
    throw new Error(response.errors.join());
  }

  const transactions = response.data;

  return transactions;
}

type GetTransactionsTotal = (chain: string, addresses: Address[]) => Promise<ListStats[]>;
export const getTransactionsTotal: GetTransactionsTotal = async (chain, addresses) => {
  const listCall = wrapResponse((await getList({
    chain,
    count: true,
    appearances: true,
    addrs: addresses,
  }) as AnyResponse<ListStats[]>));

  if (isFailedCall(listCall)) {
    throw new Error(listCall.errors.join());
  }

  return listCall.data;
};

export function fetchAll(chain: string, addresses: Address[]): ReadableStream<Transaction[]> {
  let total = 0;

  let loaded = 0;
  // TODO: it would be good to be able to cancel request in progress
  // (listen for cancelled change?)
  let cancelled = false;

  return new ReadableStream({
    async start() {
      loaded = 0;

      total = (await getTransactionsTotal(chain, addresses))[0].nRecords;
    },
    async pull(controller) {
      if (cancelled || loaded >= total) {
        controller.close();
        return;
      }

      const transactions = await fetchTransactions(chain, addresses, loaded);
      const count = transactions.length;

      if (count === 0) {
        controller.close();
        return;
      }

      loaded += count;
      controller.enqueue(transactions);
    },
    cancel() {
      cancelled = true;
      return Promise.resolve();
    },
  });
}

type GetPage = (
  getTransactions: (address: Address) => Transaction[] | undefined,
  { address, page, pageSize }: { address: Address, page: number, pageSize: number }
) => Transaction[];
export const getPage: GetPage = (getTransactions, { address, page, pageSize }) => {
  const pageStart = ((page - 1) * pageSize);
  const source = getTransactions(address);
  if (!source) {
    throw new Error(`store is empty for address ${address}`);
  }

  return source.slice(pageStart, pageStart + pageSize);
};

type GetChartItems = (transactions: Transaction[] | undefined, options: GetChartItemsOptions) => ChartInput[];
export type GetChartItemsOptions = {
  denom: 'ether' | 'dollars',
  zeroBalanceStrategy: 'ignore-non-zero' | 'ignore-zero' | 'unset',
};
type ChartInput = {
  assetAddress: string,
  assetSymbol: string,
  items: ({
    date: string,
  } & { [key: string]: number })[]
};
export const getChartItems: GetChartItems = (transactions, options) => {
  if (!transactions?.length) {
    return [];
  }

  const result: Record<string, ChartInput> = transactions
    .flatMap(({ statements }) => statements)
    .reduce((historyPerAsset, statement) => {
      if (!statement) return historyPerAsset;

      const factor = options.denom === 'dollars' ? statement.spotPrice : 1;
      const balance = (parseInt(statement.endBal, 10) || 0) * factor;

      if (balance > 0 && options.zeroBalanceStrategy === 'ignore-non-zero') {
        return historyPerAsset;
      }

      if (balance === 0 && options.zeroBalanceStrategy === 'ignore-zero') {
        return historyPerAsset;
      }

      const { timestamp } = statement;

      // TS doesn't like the fact that we can have two kinds of properties in a single
      // object: fixed `date` with string value and dynamic `[assetAddr]` with a number
      // @ts-ignore
      const currentState: ChartInput['items'] = [{
        date: (new Date(timestamp * 1000)).toISOString().replace(/T.+/, ''),
        [statement.assetAddr]: balance,
      }];
      const previousState = (historyPerAsset as Record<string, ChartInput>)[statement.assetAddr] || {
        assetAddress: statement.assetAddr,
        assetSymbol: statement.assetSymbol,
        items: [],
      };

      return {
        ...historyPerAsset,
        [statement.assetAddr]: {
          ...previousState,
          items: [
            ...previousState.items,
            ...currentState,
          ],
        },
      };
    }, {});

  const values = Object.values(result);

  const sorted = values.sort((a, b) => {
    if (b.items.length === a.items.length) {
      if (b.items.length === 0) {
        return Number(BigInt(b.assetAddress) - BigInt(a.assetAddress));
      }
      return b.items[b.items.length - 1].balance - a.items[a.items.length - 1].balance;
    }
    return b.items.length - a.items.length;
  });

  return sorted;
};
