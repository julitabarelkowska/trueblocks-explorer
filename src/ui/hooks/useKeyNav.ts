import {
  useCallback, useEffect, useMemo, useRef, useState,
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
  {
    pageSize, maxItems, stream, handleScroll,
  }: { pageSize: number, maxItems: number, stream: boolean, handleScroll: HandleScroll },
) {
  // Position in the dataset. In a set of maxItems items, it can be
  // an integer between 0 and maxItems.
  const [position, setPosition] = useState(0);
  // The navigation can be "turned off", which will not remove the
  // listeners and the logic will still work, but the state can be
  // presented as, for example, lack of highlight color.
  const on = useRef(false);
  const page = useMemo(() => Math.floor(position / pageSize) + 1, [pageSize, position]);
  const row = useMemo(() => (stream ? position % pageSize : position), [pageSize, position, stream]);
  // We also have ref for row number, so we won't introduce circular dependencies for
  // the listener callback.
  const rowRef = useRef(0);
  useEffect(() => { rowRef.current = row; }, [row]);
  // State for expanded row
  const [expandedRow, setExpandedRow] = useState(-1);
  // Let the component select a row. relativeRow is relative to the
  // data currently loaded in the table, e.g. if we have 10 items loaded,
  // the second item is 1 (we count from 0), even if it's 3rd page.
  const selectRow = useCallback((relativeRow) => {
    on.current = true;
    setPosition((page - 1) * pageSize + relativeRow);
  }, [page, pageSize]);
  // Adds `addend` to `position`. To decrease the position value just use
  // a negative `addend`.
  const incrementPosition = useCallback(
    (addend) => (currentPosition: number) => Math.max(0, Math.min(maxItems - 1, currentPosition + addend)), [maxItems],
  );

  // Handles the pressed key
  const listener = useCallback((event) => {
    const { key } = event;
    // Most of the time, arrow up or down will move by one item...
    let arrowUpAndDownAddend = 1;

    if (navigationKeys.includes(key) && on.current === false) {
      // ... but, if the navigation was "turned off" and the user
      // is turning it back on just now, we want to focus the first item
      // (which always has 0 index)
      arrowUpAndDownAddend = 0;
      on.current = true;
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
        setPosition(maxItems - 1);
        break;
      case 'Home':
        setPosition(0);
        break;
      case 'Escape':
        on.current = false;
        break;
      case 'Enter':
        event.preventDefault();
        setExpandedRow((expanded) => {
          const { current } = rowRef;
          if (current === expanded) return -1;
          return current;
        });
        break;
      default:
        // If another key was pressed, we ignore it...
        return;
    }

    // If we run into performance problems, some tests (before datastore fixes)
    // showed having `handleScroll` as a dependency here to impact the performance.
    // But, this was not observed in newer tests.
    handleScroll(event, rowRef.current, pageSize);
  }, [handleScroll, pageSize, incrementPosition, maxItems]);

  return {
    onKeyDown: listener,
    page,
    row,
    expandedRow,
    setExpandedRow,
    position,
    keyNavOn: on,
    selectRow,
    setPosition,
  };
}
