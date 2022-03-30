import { act, renderHook } from '@testing-library/react-hooks';

import { usePageBuffer } from '.';

describe('usePageBuffer hook', () => {
  it('buffers the data', async () => {
    const dataSource = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const { result } = renderHook(
      () => usePageBuffer({
        async fetchData(range) {
          return dataSource.slice(range.start, range.start + range.length);
        },
      }),
    );

    await act(async () => {
      const page = await result.current.getPage(1, 2);
      expect(page).toEqual(dataSource.slice(0, 2));
      expect(result.current.hasPage(2, 2)).toBe(true);
      expect(result.current.hasPage(3, 2)).toBe(true);

      // This page is beyond the default "prefetch" scope
      expect(result.current.hasPage(4, 2)).toBe(false);
    });

    // Now we move forward
    await act(async () => {
      const page = await result.current.getPage(4, 2);
      expect(page).toEqual(dataSource.slice(3 * 2, 3 * 2 + 2));
      // Previous pages
      expect(result.current.hasPage(3, 2)).toBe(true);
      expect(result.current.hasPage(2, 2)).toBe(true);

      // Next pages
      expect(result.current.hasPage(5, 2)).toBe(true);
      expect(result.current.hasPage(6, 2)).toBe(true);
    });

    // And backwards (through buffered data)
    await act(async () => {
      const page = await result.current.getPage(2, 2);
      expect(page).toEqual(dataSource.slice(2 * 2, 2 * 2 + 2));
      // Previous pages
      // We didn't cross the buffer limit
      expect(result.current.hasPage(1, 2)).toBe(false);

      // Next pages
      expect(result.current.hasPage(3, 2)).toBe(true);
      expect(result.current.hasPage(4, 2)).toBe(true);

      // We still have this page
      expect(result.current.hasPage(5, 2)).toBe(true);
    });

    // And backwards to unbufferred page, causing the buffer to be rebuilt
    await act(async () => {
      const page = await result.current.getPage(1, 2);
      expect(page).toEqual(dataSource.slice(0, 2));

      // No previous page, because the current range starts at index 0

      // Next pages
      expect(result.current.hasPage(2, 2)).toBe(true);
      expect(result.current.hasPage(3, 2)).toBe(true);

      // This page should now be out of the buffer
      expect(result.current.hasPage(4, 2)).toBe(false);
    });
  });

  it('cancels the data that is not needed anymore', async () => {
    const dataSource = Array.from({ length: 49 }, (value, index) => index + 1);

    const { result } = renderHook(
      () => usePageBuffer({
        fetchData(range) {
          return new Promise<number[]>((resolve) => {
            setTimeout(() => {
              const value = dataSource.slice(range.start, range.start + range.length);
              resolve(value);
            }, 100);
          });
        },
      }),
    );

    await act(async () => {
      result.current.getPage(1, 2);
      result.current.getPage(20, 2);
      result.current.getPage(8, 2);
      const page = await result.current.getPage(4, 2);

      expect(page).toEqual(dataSource.slice(6, 8));

      expect(result.current.hasPage(1, 2)).toBe(false);
      expect(result.current.hasPage(2, 2)).toBe(true);
      expect(result.current.hasPage(3, 2)).toBe(true);
      expect(result.current.hasPage(5, 2)).toBe(true);
      expect(result.current.hasPage(6, 2)).toBe(true);
      expect(result.current.hasPage(7, 2)).toBe(false);
    });
  });
});
