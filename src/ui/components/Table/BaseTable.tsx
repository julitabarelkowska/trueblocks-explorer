/* eslint-disable react/require-default-props */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { Skeleton } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import Mousetrap from 'mousetrap';

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
  activePage?: number,
  name?: string,
  showRowPlaceholder?: boolean,
  onSelectionChange?: (row: unknown) => void,
  onPageChange?: ({ page, pageSize }: { page: number, pageSize: number }) => void,
}) => {
  const [, setDisplayedRow] = useState(dataSource ? dataSource[0] : {});
  const [pageSize] = useState(defPageSize);
  const tableRef = useRef<HTMLTableElement>(document.createElement('table'));
  const {
    page,
    row,
    selectRow,
    setPosition,
  } = useKeyNav({
    pageSize,
    maxItems: totalRecords || dataSource.length,
    handleScroll: (event: KeyboardEvent, rowNumber: number, size: number) => handleSelectionScroll({
      event, tableRef, rowNumber, pageSize: size,
    }),
  });
  const [expandedRow, setExpandedRow] = useState(-1);
  const [keyedData, setKeyedData] = useState([{ key: 0 }]);

  useEffect(() => onPageChange({ page, pageSize }), [onPageChange, page, pageSize]);

  Mousetrap.bind('enter', () => {
    setExpandedRow((currentValue) => {
      if (currentValue === row) return -1; // disable

      return row;
    });
  });

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
    setDisplayedRow(keyedData[row]);
    onSelectionChange(keyedData[row]);
  }, [row, keyedData, onSelectionChange]);

  // clean up mouse control when we unmount
  useEffect(() => () => {
    Mousetrap.unbind(['enter']);
  }, []);

  const expandedRowRender = expandRender !== undefined
    ? expandRender
    : (rowContent: any) => <pre>{JSON.stringify(rowContent, null, 2)}</pre>;

  const dataWithSkeletons = useMemo(() => {
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
  }, [keyedData, page, pageSize, totalRecords]);

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
            selectRow(index);
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
            setCurRow(record.key);
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
