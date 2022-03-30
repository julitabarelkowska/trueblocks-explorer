import { useCallback, useRef, useState } from 'react';

type UsePageBufferParams<Data> = {
  fetchData: (range: { start: number, length: number }) => Promise<Array<Data>>,
}

export function usePageBuffer<Data>({ fetchData }: UsePageBufferParams<Data>) {
  const [range, setRange] = useState({ start: 0, length: 0 });
  const buffer = useRef<Array<Data>>([]);

  const pageToRange = useCallback((page: number, pageSize: number) => {
    const start = (page - 1) * pageSize;

    return { start, length: pageSize };
  }, []);
  const hasPage = useCallback((page: number, pageSize: number) => {
    // Turn page into range
    const wantedRange = pageToRange(page, pageSize);

    if (wantedRange.start < range.start) return false;

    return range.start + range.length >= wantedRange.start + wantedRange.length;
  }, [pageToRange, range.length, range.start]);

  const getPage = useCallback(async (page: number, pageSize: number) => {
    const wantedRange = pageToRange(page, pageSize);

    const prefetchMargin = 2 * pageSize;
    const prefetchStart = Math.max(0, wantedRange.start - prefetchMargin);
    const prefetchLength = (prefetchStart === 0 ? 0 : prefetchMargin) + pageSize + (prefetchMargin);
    const sliceStart = wantedRange.start - prefetchStart;

    if (hasPage(page, pageSize)) {
      // return buffer.current.slice(wantedRange.start, wantedRange.start + wantedRange.length);
      return buffer.current.slice(sliceStart, sliceStart + wantedRange.length);
    }

    const newBuffer = await fetchData({ start: prefetchStart, length: prefetchLength });
    setRange({ start: prefetchStart, length: prefetchLength });
    buffer.current = newBuffer;

    // const sliceStart = wantedRange.start - prefetchStart;

    console.log('>>>> Buffer is', buffer.current);

    return buffer.current.slice(sliceStart, sliceStart + wantedRange.length);
  }, [fetchData, hasPage, pageToRange]);

  const refresh = useCallback(async () => {
    const newBuffer = await fetchData({ start: range.start, length: range.length });

    buffer.current = newBuffer;
    console.log('>>>> Buffer is', buffer.current);

    return newBuffer;
  }, [fetchData, range.length, range.start]);

  const getRange = useCallback(() => ({
    start: range.start,
    length: range.length,
  }), [range.length, range.start]);

  const getBufferSize = useCallback(() => buffer.current.length, []);

  return {
    hasPage,
    getPage,
    getRange,
    refresh,
    getBufferSize,
  };
}
