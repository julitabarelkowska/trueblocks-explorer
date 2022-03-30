/* eslint-disable react/require-default-props */
import React, {
  useCallback,
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
  // const {
  //   page,
  //   row,
  //   selectRow,
  //   setPosition,
  // } = useKeyNav({
  //   pageSize,
  //   maxItems: totalRecords || dataSource.length,
  //   handleScroll: (event: KeyboardEvent, rowNumber: number, size: number) => handleSelectionScroll({
  //     event, tableRef, rowNumber, pageSize: size,
  //   }),
  // });
  const [expandedRow, setExpandedRow] = useState(-1);
  const [keyedData, setKeyedData] = useState([{ key: 0 }]);

  const [position, setPosition] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRow, setCurrentRow] = useState(0);

  useEffect(() => onPageChange({ page: currentPage, pageSize }), [currentPage, onPageChange, pageSize]);

  Mousetrap.bind('enter', () => {
    setExpandedRow((currentValue) => {
      if (currentValue === currentRow) return -1; // disable

      return currentRow;
    });
  });

  /* !!! */
  const setRowNumber = useCallback((n: number) => {
    const num = Math.max(0, Math.min(totalRecords || dataSource.length - 1, n));
    const page = Math.floor(num / pageSize) + 1;

    setPosition(num);
    setCurrentRow(n % pageSize);
    setCurrentPage(page);
    // if (name !== '') {
    //   sessionStorage.setItem(`curRow${name}`, num.toString());
    //   sessionStorage.setItem(`curPage${name}`, page.toString());
    // }
    return { row: num, page };
  }, [dataSource.length, pageSize, totalRecords]);

  const setRowAndHandleScroll = useCallback((event: KeyboardEvent, rowNumber: number) => {
    const { row } = setRowNumber(rowNumber);
    handleSelectionScroll({
      event,
      tableRef,
      rowNumber: row,
      pageSize,
    });
  }, [pageSize, setRowNumber]);

  Mousetrap.bind('up', (event) => setRowAndHandleScroll(event, position - 1));
  Mousetrap.bind('down', (event) => setRowAndHandleScroll(event, position + 1));
  Mousetrap.bind(['left', 'pageup'], (event) => setRowAndHandleScroll(event, position - pageSize));
  Mousetrap.bind(['right', 'pagedown'], (event) => setRowAndHandleScroll(event, position + pageSize));
  Mousetrap.bind('home', (event) => setRowAndHandleScroll(event, 0));
  Mousetrap.bind('end', (event) => setRowAndHandleScroll(event, dataSource.length - 1));

  // clean up mouse control when we unmount
  useEffect(() => () => {
    // setCurRow(0);
    // setCurPage(1);
    Mousetrap.unbind(['up', 'down', 'pageup', 'pagedown', 'home', 'end', 'enter']);
  }, []);

  /* !!! */

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
    setDisplayedRow(keyedData[currentRow]);
    onSelectionChange(keyedData[currentRow]);
  }, [keyedData, onSelectionChange, currentRow]);

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
      if (currentPage === lastPage) {
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
  }, [currentPage, keyedData, pageSize, totalRecords]);

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
            setCurrentRow(index || 0);
          },
          style: record.key === currentRow ? { color: 'darkblue', backgroundColor: 'rgb(236, 235, 235)' } : {},
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
            setCurrentRow(record.key);
          },
        }}
        pagination={{
          onChange: (newPage, newPageSize) => {
            // onPageChange({ page: newPage, pageSize: newPageSize || defPageSize });

            setCurrentRow(0);
            // setPosition((newPage - 1) * pageSize);
          },
          total: totalRecords,
          pageSize,
          current: currentPage,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
        }}
      />
    </div>
  );
};
