import React, { useMemo } from 'react';

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
  const treeModel = useMemo(() => makeTreeFromObject(data), [data]);
  const combinedOnValue: OnValue = (path, value) => {
    if (value.kind === 'tooDeep') {
      return onTooDeep();
    }

    return onValue(path, value);
  };

  return (
    <div className='data-display'>
      { showCopy
        ? <CopyAsJson content={data} />
        : null}
      {treeModelToComponents(treeModel, [], combinedOnValue)}
    </div>
  );
}

DataDisplay.defaultProps = {
  onTooDeep: defaultOnTooDeep,
  showCopy: true,
};
