import React, { useMemo } from 'react';

import { Alert } from 'antd';

import { CopyAsJson } from '@components/CopyAsJson';
import { createMakeTreeFromObject, OnValue, treeModelToComponents } from '@modules/tree';

import './JsonDisplay.css';

const tooDeep = 'TOO_DEEP';
const makeTreeFromObject = createMakeTreeFromObject({
  maxDeep: 3,
  onTooDeep: () => tooDeep,
  onEmpty: () => [],
});

const defaultOnTooDeep = () => (
  <Alert message='Too many nested levels to display data' type='info' showIcon />
);

export function JsonDisplay(
  {
    data, onValue, onTooDeep = defaultOnTooDeep, showCopy = true,
  }: { data: {}, onValue: OnValue, onTooDeep?: () => JSX.Element, showCopy?: boolean},
) {
  const treeModel = useMemo(() => makeTreeFromObject(data), [data]);
  const combinedOnValue: OnValue = (path, value) => {
    if (value === tooDeep) {
      return onTooDeep();
    }

    return onValue(path, value);
  };

  return (
    <div className='json-display'>
      {treeModelToComponents(treeModel, [], combinedOnValue)}
      { showCopy
        ? <CopyAsJson content={data} />
        : null}
    </div>
  );
}

JsonDisplay.defaultProps = {
  onTooDeep: defaultOnTooDeep,
  showCopy: true,
};
