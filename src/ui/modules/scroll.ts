import { RefObject } from 'react';

// Checks if the whole element is visible in the scrolled area.
type IsElementOverflowingParent = (element: Element, parent: HTMLElement | null) => boolean;

export const isElementOverflowingParent: IsElementOverflowingParent = (element, parent) => {
  const {
    top,
    bottom,
  } = element.getBoundingClientRect();
  const mainRect = parent?.getBoundingClientRect();

  return top - Number(mainRect?.top) < 0
    || bottom - Number(mainRect?.bottom) >= 0;
};

// Scrolls element into view
type ScrollTo = (element: Element) => void;

export const scrollTo: ScrollTo = (element) => {
  element.scrollIntoView({ behavior: 'smooth' });
};

// This helper is meant for all tables with keyboard navigation. It blocks the default
// action of pressing arrow keys, which is to scroll window/parent element, unless
// the selected row is (partially) hidden.
type HandleSelectionScroll = ({
  event, tableRef, rowNumber, pageSize,
}: {
  event: KeyboardEvent,
  tableRef: RefObject<HTMLTableElement>,
  rowNumber: number,
  pageSize: number
}) => void;

export const handleSelectionScroll: HandleSelectionScroll = ({
  event, tableRef, rowNumber, pageSize,
}) => {
  // We don't want browser to scroll the view automatically
  event.preventDefault();

  const element = tableRef.current;

  if (!element) return;

  // Find all <tr> elements in the table (and not nested tables)
  const rows = element.querySelectorAll('table:not(table table) > tbody > tr');
  // We need to convert row number (which is given data item index) to DOM child index
  const selectedRowIndex = rowNumber % pageSize;
  // Now we can find the selected row's DOM element
  const selectedRowElement = rows[selectedRowIndex];

  if (!selectedRowElement) return;

  // If the element is overflowing parent (the view in this case) we want to
  // scroll it into view
  const overflowing = isElementOverflowingParent(
    selectedRowElement,
    document.querySelector('main'),
  );

  if (overflowing) {
    scrollTo(selectedRowElement);
  }
};
