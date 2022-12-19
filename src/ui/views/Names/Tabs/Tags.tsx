import React from 'react';

import { ColumnsType } from 'antd/lib/table';
import { getNames } from 'trueblocks-sdk';

import { ResourceTable } from '@components/ResourceTable';
import {
  addActionsColumn, addColumn, TableActions,
} from '@components/Table';
import { useSdk } from '@hooks/useSdk';
import { Tag } from '@modules/types/Tag';

import { useGlobalState } from '../../../State';

export const Tags = () => {
  const { chain } = useGlobalState();
  const dataCall = useSdk(() => getNames({
    chain: chain.chain,
    terms: [],
    tags: true,
  }));

  return (
    <ResourceTable
      resourceName='tags'
      call={dataCall}
      columns={tagSchema}
    />
  );
};

const tagSchema: ColumnsType<Tag> = [
  addColumn<Tag>({
    title: 'ID',
    dataIndex: 'tags',
  }),
  addActionsColumn<Tag>(
    {
      title: '',
      dataIndex: '',
    },
    {
      width: 150,
      getComponent: getTableActions,
    },
  ),
];

function getTableActions(item: Tag) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}
