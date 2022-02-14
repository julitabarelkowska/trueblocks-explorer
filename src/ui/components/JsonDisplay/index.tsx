import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CopyTwoTone } from '@ant-design/icons';
import { Name } from '@sdk';
import { useGlobalState } from '@state';
import { Alert, Button } from 'antd';

import { createTraverser, OnValue, treeModelToComponents } from '@modules/tree';

import { DashboardAccountsLocation } from '../../Routes';

import './JsonDisplay.css';

const tooDeep = 'TOO_DEEP';
const traverseObject = createTraverser({
  maxDeep: 3,
  onTooDeep: () => tooDeep,
  onEmpty: () => [],
});

// TODO: Merge with RenderAddress component?
const renderAddress = (address: string, names: Map<string, Name>) => (
  <>
    <Link to={{
      pathname: DashboardAccountsLocation, search: String(new URLSearchParams({ address: String(address) })),
    }}
    >
      {address}
    </Link>
    <Button
      type='text'
      onClick={() => navigator.clipboard.writeText(String(address))}
    >
      <CopyTwoTone />
    </Button>
    <div>
      {names.has(String(address))
        ? names.get(String(address))?.name
        : null}
    </div>
  </>
);

type CreateOnValue = (names: Map<string, Name>) => OnValue;

const createOnValue: CreateOnValue = (names) => {
  const onValue: OnValue = (path, value) => {
    if (value === tooDeep) {
      return (
        <Alert message='Too many nested levels to display data' type='info' showIcon />
      );
    }

    if (path[0] === 'address') {
      return renderAddress(String(value), names);
    }

    if ((path[0] === 'articulatedLog' && path[1] === 'inputs') && (path[2] === '_from' || path[2] === '_to')) {
      return renderAddress(String(value), names);
    }

    if (path[0] === 'compressedLog') {
      return (
        <>
          <code>{value}</code>
          <Button
            onClick={() => navigator.clipboard.writeText(String(value))}
            icon={<CopyTwoTone />}
          >
            Copy
          </Button>
        </>
      );
    }

    return <>{value}</>;
  };

  return onValue;
};

export function JsonDisplay({ data }: { data: {} }) {
  const { namesMap: names } = useGlobalState();

  const onValue = createOnValue(names);
  const treeModel = useMemo(() => traverseObject(data), [data]);

  return (
    <div className='json-display'>
      {treeModelToComponents(treeModel, [], onValue)}
      <Button
        onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
        icon={<CopyTwoTone />}
      >
        Copy as JSON
      </Button>
    </div>
  );
}
