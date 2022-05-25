/* eslint-disable react/require-default-props */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { Skeleton } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';

import { useKeyNav } from '@hooks/useKeyNav';
import { handleSelectionScroll } from '@modules/scroll';

import 'antd/dist/antd.css';

type JsonResponse = Record<string, any>;

export const BaseTable = ({
  dataSource,
  columns,
  loading,
  extraData,
  expandRender = undefined,
  defPageSize = 7,
  totalRecords,
  showRowPlaceholder = false,
  onSelectionChange = () => { },
  onPageChange = () => { },
}: {
  dataSource: JsonResponse;
  columns: ColumnsType<any>;
  loading: boolean;
  extraData?: string;
  expandRender?: (row: any) => JSX.Element;
  defPageSize?: number;
  totalRecords?: number,
  showRowPlaceholder?: boolean,
  onSelectionChange?: (row: unknown) => void,
  onPageChange?: ({ page, pageSize }: { page: number, pageSize: number }) => void,
}) => {
  const [pageSize] = useState(defPageSize);
  const tableRef = useRef<HTMLTableElement>(document.createElement('table'));
  const {
    page,
    row,
    expandedRow,
    setExpandedRow,
    selectRow,
    setPosition,
  } = useKeyNav({
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

  useEffect(() => {
    const listener = () => {
      onSelectionChange(keyedData[row]);
    };
    // We have to bind to window, because Ant Design makes it
    // impossible to get keyup event from their components.
    window.addEventListener('keyup', listener);
    return () => window.removeEventListener('keyup', listener);
  }, [keyedData, onSelectionChange, row]);

  // We will execute this effect only once, to notify the parent about
  // the default (first) item being selected when BaseTable mounts.
  const parentalreadynotified = useRef(false);
  useEffect(() => {
    if (parentalreadynotified.current) return;
    parentalreadynotified.current = true;
    onSelectionChange(keyedData[row]);
  });

  const expandedRowRender = expandRender !== undefined
    ? expandRender
    : (rowContent: any) => <pre>{JSON.stringify(rowContent, null, 2)}</pre>;

  const dataWithSkeletons = useMemo(() => {
    if (page === 1) {
      return keyedData;
    }

    const lastPage = Math.ceil(Number(totalRecords) / pageSize);
    const missingItems = (() => {
      // The last page of data can have less items than pageSize, but it will
      // always be modulo of totalRecords and pageSize
      if (page === lastPage) {
        const expectedItems = Number(totalRecords) % pageSize;
        return expectedItems - keyedData.length;
      }

      return pageSize - keyedData.length;
    })();

    if (missingItems === 0) return keyedData;

    return Array.from({ length: pageSize }, (v, index) => {
      if (keyedData[index] !== undefined) return keyedData[index];

      return {
        key: `skeleton-${index}`,
      };
    });
  }, [page, keyedData, pageSize, totalRecords]);

  const columnsWithSkeletons = useMemo(() => {
    if (keyedData.length >= pageSize) return columns;

    const skeletonRegexp = /skeleton-/;

    return columns.map((column) => ({
      ...column,
      // TODO: replace `any`when we fix typing for `columns`
      render(text: string, record: any, index: number) {
        if (!skeletonRegexp.test(record.key)) return column.render?.(text, record, index);

        return <Skeleton paragraph={{ rows: 3 }} title={false} active key={column.key} />;
      },
    }));
  }, [columns, keyedData.length, pageSize]);

  return (
    <div ref={tableRef}>
      <Table
        onRow={(record, index) => ({
          onClick: () => {
            selectRow(index || 0);
          },
          style: record.key === row ? { color: 'darkblue', backgroundColor: 'rgb(236, 235, 235)' } : {},
        })}
        size='small'
        loading={loading}
        columns={showRowPlaceholder ? columnsWithSkeletons : columns}
        dataSource={showRowPlaceholder ? dataWithSkeletons : keyedData}
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
