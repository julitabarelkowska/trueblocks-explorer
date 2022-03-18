import React from 'react';

import {
  ArrayNode, MakeTreeFromObject, Node, TooDeep,
} from './fromObject';

function isArray<T>(v: unknown): v is Array<T> {
  return Array.isArray(v);
}

// We have to satisfy TS, which considers [] and [1,2,3] to be
// different types: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-3.html#caveats
function isEmptyArray(v: unknown): v is [] {
  return Array.isArray(v) && v.length === 0;
}

export type OnValue = (path: string[], node: Node | TooDeep) => JSX.Element;
const defaultOnValue: OnValue = (path, value) => (<>{value}</>);

const getArrayItems = (node: ArrayNode, path: string[], onValue: OnValue) => {
  const items = node.value.map((value, index) => {
    const reactKey = `${path.join('-')}${index}`;
    return (<li key={reactKey}>{treeModelToComponents(value, path, onValue)}</li>);
  });
  return (
    <ol>
      {items}
    </ol>
  );
};

export function treeModelToComponents(
  model: ReturnType<MakeTreeFromObject>,
  path: string[],
  onValue: OnValue = defaultOnValue,
) {
  if (!isArray(model)) {
    if (model.kind === 'array') {
      return getArrayItems(model, path, onValue);
    }

    return (
      <React.Fragment key={path.join('-')}>
        {onValue(path, model)}
      </React.Fragment>
    );
  }

  const subtree = isEmptyArray(model) ? null : model.map((submodel) => {
    // This should never happen:
    // if (submodel.kind === 'array') {
    //   const items = submodel.value.map((value) => treeModelToComponents(value, path, onValue));
    //   return (
    //     <ol>
    //       {items}
    //     </ol>
    //   );
    // }

    const { key } = submodel;
    // @ts-ignore
    const valueResult = treeModelToComponents(submodel.value, [...path, key], onValue);

    return (
      <dl key={[...path, key].join('-')}>
        <dt>{key}</dt>
        <dd>{valueResult}</dd>
      </dl>
    );
  });

  return (
    <div className='treeRoot'>
      { subtree}
    </div>
  );
}
