import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

const navigationKeys = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'PageUp',
  'ArrowRight',
  'PageDown',
  'End',
  'Home',
];

type HandleScroll = (event: KeyboardEvent, rowNumber: number, size: number) => void;

// Adds keyboard navigation logic. The hook returns row and page
// values that get increased/decreased when the arrow keys, page up,
// page down, home and end keys are pressed.
export function useKeyNav(
  { pageSize, maxItems, handleScroll }: { pageSize: number, maxItems: number, handleScroll: HandleScroll },
) {
  // Position in the dataset. In a set of maxItems items, it can be
  // an integer between 0 and maxItems.
  const [position, setPosition] = useState(0);
  // The navigation can be "turned off", which will not remove the
  // listeners and the logic will still work, but the state can be
  // presented as, for example, lack of highlight color.
  const [on, setOn] = useState(false);
  const page = useMemo(() => Math.floor(position / pageSize) + 1, [pageSize, position]);
  const row = useMemo(() => position % pageSize, [pageSize, position]);
  // Let the component select a row. relativeRow is relative to the
  // data currently loaded in the table, e.g. if we have 10 items loaded,
  // the second item is 1 (we count from 0), even if it's 3rd page.
  const selectRow = useCallback((relativeRow) => {
    setOn(true);
    setPosition((page - 1) * pageSize + relativeRow);
  }, [page, pageSize]);

  // Adds `addend` to `position`. To decrease the position value just use
  // a negative `addend`.
  const incrementPosition = useCallback(
    (addend) => (currentPosition: number) => Math.max(0, Math.min(maxItems, currentPosition + addend)), [maxItems],
  );
  // Handles the pressed key
  const listener = useCallback((event) => {
    const { key } = event;
    // Most of the time, arrow up or down will move by one item...
    let arrowUpAndDownAddend = 1;

    if (navigationKeys.includes(key) && on === false) {
      // ... but, if the navigation was "turned off" and the user
      // is turning it back on just now, we want to focus the first item
      // (which always has 0 index)
      arrowUpAndDownAddend = 0;
      setOn(true);
    }

    switch (key) {
      case 'ArrowUp':
        setPosition(incrementPosition(-arrowUpAndDownAddend));
        break;
      case 'ArrowDown':
        setPosition(incrementPosition(+arrowUpAndDownAddend));
        break;
      case 'ArrowLeft':
      case 'PageUp':
        setPosition(incrementPosition(-pageSize));
        break;
      case 'ArrowRight':
      case 'PageDown':
        setPosition(incrementPosition(+pageSize));
        break;
      case 'End':
        setPosition(maxItems);
        break;
      case 'Home':
        setPosition(0);
        break;
      case 'Escape':
        setOn(false);
        break;
      default:
        return;
    }
    handleScroll(event, row, pageSize);
  }, [on, handleScroll, row, pageSize, incrementPosition, maxItems]);

  useEffect(() => {
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [listener]);

  return {
    page,
    row,
    position,
    keyNavOn: on,
    selectRow,
    setPosition,
  };
}
