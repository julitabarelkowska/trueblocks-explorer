import { useCommand } from './useCommand';
import { CommandParams, CoreCommand } from '@modules/core';
import { useCallback } from 'react';

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
