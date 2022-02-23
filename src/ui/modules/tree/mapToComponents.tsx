import React from 'react';

import { MakeTreeFromObject } from './fromObject';

const isArray = function <T> (v: unknown): v is Array<T> {
  return Array.isArray(v);
};

// We have to satisfy TS, which considers [] and [1,2,3] to be
// different types: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-3.html#caveats
const isEmptyArray = function (v: unknown): v is [] {
  return Array.isArray(v) && v.length === 0;
};

export type OnValue = (path: string[], value: string | number | boolean) => JSX.Element;
const defaultOnValue: OnValue = (path, value) => (<>{value}</>);

export function treeModelToComponents(
  model: ReturnType<MakeTreeFromObject>,
  path: string[],
  onValue: OnValue = defaultOnValue,
) {
  if (!isArray(model)) {
    return onValue(path, model);
  }

  const subtree = isEmptyArray(model) ? null : model.map((submodel) => {
    const [key, valueOrChildren] = submodel;
    const valueResult = treeModelToComponents(valueOrChildren, [...path, key], onValue);

    const subtreeKey = [...path, key].join('-');

    return (
      <div key={subtreeKey} style={{ display: 'grid', gridTemplateColumns: '1fr 6fr' }}>
        <dt>{key}</dt>
        <dd>{valueResult}</dd>
      </div>
    );
  });

  const key = path.join('-');
  return (
    <dl key={key}>
      { subtree}
    </dl>
  );
}
