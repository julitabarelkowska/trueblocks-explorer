import React, {
  useCallback, useEffect, useState,
} from 'react';

import { Alert } from 'antd';

import { CopyAsJson } from '@components/CopyAsJson';
import { createMakeTreeFromObject, OnValue, treeModelToComponents } from '@modules/tree';

import './DataDisplay.css';

const makeTreeFromObject = createMakeTreeFromObject({
  maxDeep: 3,
});

const defaultOnTooDeep = () => (
  <Alert message='Too many nested levels to display data' type='info' showIcon />
);

export function DataDisplay(
  {
    data, onValue, onTooDeep = defaultOnTooDeep, showCopy = true,
  }: { data: {}, onValue: OnValue, onTooDeep?: () => JSX.Element, showCopy?: boolean},
) {
  const combinedOnValue: OnValue = useCallback((path, value) => {
    if (value.kind === 'tooDeep') {
      return onTooDeep();
    }

    return onValue(path, value);
  }, [onTooDeep, onValue]);

  const [content, setContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    // When this component rerenders, we want to "cancel" (i.e. ignore) tree model
    // and components. Otherwise, it would block when keyboard scrolling the transaction
    // list fast.
    let cancel = false;

    // Making the main operation `async` forces JS engine to put it into another event loop,
    // so it will not block. But we still need the ability to cancel it, because we don't
    // want to show previous results if the user has already moved to another transaction.
    (async () => {
      const treeModel = makeTreeFromObject(data);
      if (cancel) return;

      const components = treeModelToComponents(treeModel, [], combinedOnValue);
      if (cancel) return;

      setContent(components);
    })();

    return () => { cancel = true; };
  }, [combinedOnValue, data]);

  return (
    <div className='data-display'>
      { showCopy
        ? <CopyAsJson content={data} />
        : null}
      {content}
    </div>
  );
}

DataDisplay.defaultProps = {
  onTooDeep: defaultOnTooDeep,
  showCopy: true,
};
