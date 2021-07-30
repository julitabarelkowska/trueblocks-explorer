import { addActionsColumn, addColumn, BaseTable, TableActions } from '@components/Table';
import { useFetchData } from '@hooks/useCommand';
import { createErrorNotification } from '@modules/error_notification';
import { Function } from '@modules/types';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

export const FunctionSignatures = () => {
  const filterFunc = (item: Function) => item.type !== 'event';
  const { theData, loading, status } = useFetchData('abis', { known: true, source: true, verbose: 2 }, filterFunc);

  if (status === 'fail') {
    createErrorNotification({
      description: 'Could not fetch function signature data',
    });
  }

  return <BaseTable dataSource={theData} columns={signatureSchema} loading={loading} />;
};

const signatureSchema: ColumnsType<Function> = [
  addColumn<Function>({
    title: 'Source',
    dataIndex: 'abi_source',
    configuration: {
      width: 200,
    },
  }),
  addColumn<Function>({
    title: 'Encoding',
    dataIndex: 'encoding',
  }),
  addColumn<Function>({
    title: 'Name',
    dataIndex: 'name',
  }),
  addColumn<Function>({
    title: 'Signature',
    dataIndex: 'signature',
  }),
  addActionsColumn<Function>(
    {
      title: '',
      dataIndex: '',
    },
    {
      width: 150,
      getComponent: getTableActions,
    }
  ),
];

function getTableActions(item: Function) {
  return <TableActions item={item} onClick={(action, tableItem) => console.log('Clicked action', action, tableItem)} />;
}
