import React, { useEffect, useMemo } from 'react';

import { ColumnsType } from 'antd/lib/table';
import { getConfig, PinnedChunk } from 'trueblocks-sdk';

import { BaseView } from '@components/BaseView';
import { addColumn, addNumColumn } from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import { isFailedCall, isSuccessfulCall } from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';
import { createEmptyStatus } from '@modules/types/Status';

import { IndexCacheItem } from '../../../../sdk/generated_ts/types/indexCacheItem';
import {
  SettingsIndexesChartsLocation,
  SettingsIndexesGridLocation,
  SettingsIndexesLocation,
  SettingsIndexesManifestLocation,
  SettingsIndexesTableLocation,
} from '../../../Routes';
import { useGlobalState } from '../../../State';
import { IndexCharts } from './SubTabs/IndexCharts';
import { IndexGrid } from './SubTabs/IndexGrid';
import { IndexManifest } from './SubTabs/IndexManifest';
import { IndexTable } from './SubTabs/IndexTable';

export const IndexesView = () => {
  const { chain } = useGlobalState();
  const statusCall = useSdk(() => getConfig({
    chain: chain.chain,
    modes: ['show'],
    module: ['index'],
    details: true,
  }));

  const theGridData = useMemo(() => {
    if (isSuccessfulCall(statusCall)) {
      if (statusCall.data) {
        return statusCall.data[0].caches[0].items;
      }
      return statusCall.data;
    }
    return [createEmptyStatus()];
  }, [statusCall]) as any as IndexCacheItem[];

  useEffect(() => {
    if (isFailedCall(statusCall)) {
      createErrorNotification({
        description: 'Could not fetch indexes',
      });
    }
  }, [statusCall]);

  const title = <h3>The Unchained Index</h3>;
  const tabs = [
    {
      name: 'Grid',
      location: [SettingsIndexesLocation, SettingsIndexesGridLocation],
      component: <IndexGrid key='grid' theData={theGridData} title={title} loading={statusCall.loading} />,
    },
    {
      name: 'Table',
      location: SettingsIndexesTableLocation,
      component: <IndexTable key='table' theData={theGridData} title={title} loading={statusCall.loading} />,
    },
    {
      name: 'Charts',
      location: SettingsIndexesChartsLocation,
      component: <IndexCharts key='chart' theData={theGridData} title={title} loading={statusCall.loading} />,
    },
    {
      name: 'Manifest',
      location: SettingsIndexesManifestLocation,
      component: <IndexManifest key='manifest' />,
    },
  ];

  return (
    <BaseView title='' cookieName='COOKIE_SETTINGS_INDEX' tabs={tabs} position='left' />
  );
};

function padLeft(num: number, size: number, char: string = '0') {
  let s = `${num}`;
  while (s.length < size) s = char + s;
  return s;
}

const renderBlockRange = (record: PinnedChunk) => (
  <div>
    <div>
      {padLeft(record.firstApp, 9)}
      -
      {padLeft(record.latestApp, 9)}
    </div>
    <i>
      {Intl.NumberFormat().format(record.latestApp - record.firstApp + 1)}
      {' '}
      blocks
    </i>
  </div>
);

export const indexSchema: ColumnsType<PinnedChunk> = [
  addColumn({
    title: 'Block Range',
    dataIndex: 'firstApp',
    configuration: {
      render: (item, record) => renderBlockRange(record),
      width: '200px',
    },
  }),
  addColumn({
    title: 'File Date',
    dataIndex: 'fileDate',
  }),
  addNumColumn({
    title: 'nAddrs',
    dataIndex: 'nAddrs',
  }),
  addNumColumn({
    title: 'nApps',
    dataIndex: 'nApps',
    configuration: {
      render: (item: number) => <div style={{ color: 'blue', fontWeight: 600 }}>{item}</div>,
    },
  }),
  addNumColumn({
    title: 'firstTs',
    dataIndex: 'firstTs',
  }),
  addNumColumn({
    title: 'latestTs',
    dataIndex: 'latestTs',
  }),
  addNumColumn({
    title: 'indexSizeBytes',
    dataIndex: 'indexSizeBytes',
  }),
  addNumColumn({
    title: 'bloomSizeBytes',
    dataIndex: 'bloomSizeBytes',
  }),
  addColumn({
    title: 'indexHash',
    dataIndex: 'indexHash',
  }),
  addColumn({
    title: 'bloomHash',
    dataIndex: 'bloomHash',
  }),
];
