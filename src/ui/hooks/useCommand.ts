import { CommandParams, CoreCommand, JsonResponse, runCommand } from '@modules/core';
import { either as Either } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { useCallback, useEffect, useState } from 'react';

type DataResult = {
  status: 'success';
  data: JsonResponse[];
  meta: {};
};

type ScrapeResult = {
  status: 'success';
  monitor: JsonResponse;
  indexer: JsonResponse;
};

type FailedResult = {
  status: 'fail';
  data: string;
  meta: {};
};

type FailedScrapeResult = {
  status: 'fail';
  monitor: JsonResponse;
  indexer: JsonResponse;
};

export type Result = DataResult | FailedResult;

export type ScraperResult = ScrapeResult | FailedScrapeResult;

export function toFailedResult(error: Error): FailedResult {
  return {
    status: 'fail',
    data: error.toString(),
    meta: {},
  };
}

export function toFailedScrapeResult(error: Error): FailedScrapeResult {
  return {
    status: 'fail',
    monitor: { Running: false },
    indexer: { Running: false },
  };
}

export function toSuccessfulData(responseData: JsonResponse): DataResult {
  return {
    status: 'success',
    data: responseData.data,
    meta: responseData.meta,
  };
}

export function toSuccessfulScraperData(responseData: JsonResponse): ScrapeResult {
  return {
    status: 'success',
    monitor: responseData.monitor,
    indexer: responseData.indexer,
  };
}

export const emptyData = { data: [{}], meta: {} };

export function useFetchData(command: CoreCommand, params?: CommandParams, filterFunc?: any) {
  const [result, loading] = useCommand(command, params);
  if (result.status === 'fail') return { theData: [], theMeta: {}, status: 'fail', loading: false };
  const getData = useCallback((response) => {
    if (filterFunc) {
      return response.data.filter((item: any) => filterFunc(item));
    }
    return response.data;
  }, []);
  const getMeta = useCallback((response) => {
    return response.meta;
  }, []);

  return { theData: getData(result), theMeta: getMeta(result), status: result.status, loading: loading };
}

export function useCommand(command: CoreCommand, params?: CommandParams) {
  const [response, setData] = useState<Result>(toSuccessfulData(emptyData));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const eitherResponse = await runCommand(command, params);
      const result: Result = pipe(
        eitherResponse,
        Either.fold(toFailedResult, (serverResponse) => toSuccessfulData(serverResponse) as Result)
      );
      setData(result);
      setLoading(false);
    })();
  }, []);

  return [response, loading] as const;
}
