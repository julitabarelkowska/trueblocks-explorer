import React from 'react';

import { Block, getBlocks } from '@sdk';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';

import {
  addColumn, addNumColumn, BaseTable,
} from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import { isFailedCall, isSuccessfulCall } from '@modules/api/call_status';
import { createErrorNotification } from '@modules/error_notification';

import { useGlobalState } from '../../../State';

export const Blocks = () => {
  const { chain } = useGlobalState();

  const blocksCall = useSdk(() => getBlocks({
    chain: chain.chain,
    blocks: [],
    list: 0,
    listCount: 12,
    cache: true,
  }));

  if (isFailedCall(blocksCall)) {
    createErrorNotification({
      description: 'Could not fetch blocks',
    });
  }

  const theData = isSuccessfulCall(blocksCall) ? blocksCall.data : [];

  return <BaseTable dataSource={theData} columns={blockListSchema} loading={blocksCall.loading} />;
};

export type BlockModel =
  Block
  & {
    gasUsed: string,
  }

const blockListSchema: ColumnsType<BlockModel> = [
  addColumn({
    title: 'Date',
    dataIndex: 'timestamp',
    configuration: {
      render: (value) => (
        <div>
          <div>{dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss')}</div>
          <div style={{ fontStyle: 'italic' }}>{dayjs.unix(value).fromNow()}</div>
        </div>
      ),
    },
  }),
  addColumn({
    title: 'Hash',
    dataIndex: 'hash',
    configuration: {
      render: (value, record) => (
        <div>
          <div>{value}</div>
          <div style={{ fontStyle: 'italic' }}>{record.blockNumber}</div>
        </div>
      ),
      width: 620,
    },
  }),
  addColumn({
    title: 'Miner',
    dataIndex: 'miner',
    configuration: {
      render: (value, record) => (
        <div>
          <div>{value}</div>
          <div style={{ fontStyle: 'italic' }}>
            {record.unclesCnt === null || record.unclesCnt === 0 ? '' : `${record.unclesCnt} uncle`}
          </div>
        </div>
      ),
      width: 400,
    },
  }),
  addNumColumn({
    title: 'Difficulty',
    dataIndex: 'difficulty',
    configuration: {
      render: (value, record) => (
        <div>{record.difficulty}</div>
      ),
      width: 180,
    },
  }),
  addNumColumn({
    title: 'Gas Used',
    dataIndex: 'gasUsed',
    configuration: {
      render: (value, record) => (
        <div>{record.gasUsed}</div>
      ),
    },
  }),
  addNumColumn({
    title: 'Gas Limit',
    dataIndex: 'gasLimit',
    configuration: {
      render: (value, record) => (
        <div>{record.gasLimit}</div>
      ),
    },
  }),
  addNumColumn({
    title: 'nTransactions',
    dataIndex: 'transactionsCnt',
  }),
];
