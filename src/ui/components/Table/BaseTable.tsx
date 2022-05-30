/* eslint-disable react/require-default-props */
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import Table, { ColumnsType } from 'antd/lib/table';

import { useKeyNav } from '@hooks/useKeyNav';
import { handleSelectionScroll } from '@modules/scroll';

import 'antd/dist/antd.css';

type JsonResponse = Record<string, any>;

export const BaseTable = ({
  dataSource,
  streamSource,
  columns,
  loading,
  extraData,
  expandRender = undefined,
  defPageSize = 7,
  totalRecords,
  onSelectionChange = () => { },
  onPageChange = () => { },
}: {
  dataSource: JsonResponse;
  streamSource?: boolean,
  columns: ColumnsType<any>;
  loading: boolean;
  extraData?: string;
  expandRender?: (row: any) => JSX.Element;
  defPageSize?: number;
  totalRecords?: number,
  onSelectionChange?: (row: unknown) => void,
  onPageChange?: ({ page, pageSize }: { page: number, pageSize: number }) => void,
}) => {
  const [pageSize] = useState(defPageSize);
  const tableRef = useRef<HTMLTableElement>(document.createElement('table'));
  const {
    onKeyDown,
    page,
    row,
    expandedRow,
    setExpandedRow,
    selectRow,
    setPosition,
  } = useKeyNav({
    stream: Boolean(streamSource),
    pageSize,
    maxItems: totalRecords || dataSource.length,
    handleScroll: (event: KeyboardEvent, rowNumber: number, size: number) => handleSelectionScroll({
      event, tableRef, rowNumber, pageSize: size,
    }),
  });
  const [keyedData, setKeyedData] = useState([{ key: 0 }]);

  useEffect(() => {
    onPageChange({ page, pageSize });
  }, [page, onPageChange, pageSize]);

  useEffect(() => {
    setKeyedData(
      dataSource
        ? dataSource.map((record: any, index: number) => {
          if (record.key !== undefined) console.log('BaseTable assigns the key field, data should not.');
          return {
            key: index,
            extraData,
            ...record,
          };
        })
        : [],
    );
  }, [dataSource, extraData]);

  const onKeyUp = () => onSelectionChange(keyedData[row]);

  // We will execute this effect only once, to notify the parent about
  // the default (first) item being selected when BaseTable mounts.
  const parentAlreadyNotified = useRef(false);
  useEffect(() => {
    if (parentAlreadyNotified.current) return;
    parentAlreadyNotified.current = true;
    onSelectionChange(keyedData[row]);
  });

  const expandedRowRender = expandRender !== undefined
    ? expandRender
    : (rowContent: any) => <pre>{JSON.stringify(rowContent, null, 2)}</pre>;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div ref={tableRef} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={-1}>
      <Table
        onRow={(record, index) => ({
          onClick: () => {
            selectRow(index || 0);
          },
          style: record.key === row ? { color: 'darkblue', backgroundColor: 'rgb(236, 235, 235)' } : {},
        })}
        size='small'
        loading={loading}
        columns={columns}
        dataSource={keyedData}
        expandable={{
          expandedRowRender,
          expandedRowKeys: [expandedRow],
          onExpand(expanded, record) {
            setExpandedRow(expanded ? record.key : -1);
            selectRow(record.key);
          },
        }}
        pagination={{
          onChange: (newPage, newPageSize) => {
            onPageChange({ page: newPage, pageSize: newPageSize || defPageSize });

            setPosition((newPage - 1) * pageSize);
          },
          total: totalRecords,
          pageSize,
          current: page,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
        }}
      />
    </div>
  );
};
