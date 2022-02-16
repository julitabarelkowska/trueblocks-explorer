/* eslint-disable react/require-default-props */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import Table, { ColumnsType } from 'antd/lib/table';
import Mousetrap from 'mousetrap';

import { handleSelectionScroll } from '@modules/scroll';

import 'antd/dist/antd.css';

type JsonResponse = Record<string, any>;

export const BaseTable = ({
  dataSource,
  columns,
  loading,
  extraData,
  expandRender = undefined,
  siderRender = undefined,
  defPageSize = 7,
  name = '',
}: {
  dataSource: JsonResponse;
  columns: ColumnsType<any>;
  loading: boolean;
  extraData?: string;
  expandRender?: (row: any) => JSX.Element;
  siderRender?: (record: any) => JSX.Element;
  defPageSize?: number;
  name?: string;
}) => {
  const [displayedRow, setDisplayedRow] = useState(dataSource ? dataSource[0] : {});
  const [curRow, setCurRow] = useState(Number(sessionStorage.getItem(`curRow${name}`)) || 0);
  const [curPage, setCurPage] = useState(Number(sessionStorage.getItem(`curPage${name}`)) || 1);
  const [pageSize, setPageSize] = useState(defPageSize);
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyedData, setKeyedData] = useState([{ key: 0 }]);
  const tableRef = useRef<HTMLTableElement>(document.createElement('table'));

  const setRowNumber = useCallback((n: number) => {
    const num = Math.max(0, Math.min(dataSource.length - 1, n));
    setCurRow(num);
    const page = Math.floor(num / pageSize) + 1;
    setCurPage(page);
    if (name !== '') {
      sessionStorage.setItem(`curRow${name}`, num.toString());
      sessionStorage.setItem(`curPage${name}`, page.toString());
    }
    return { row: num, page };
  }, [dataSource.length, name, pageSize]);

  Mousetrap.bind('up', (event) => setRowAndHandleScroll(event, curRow - 1));
  Mousetrap.bind('down', (event) => setRowAndHandleScroll(event, curRow + 1));
  Mousetrap.bind(['left', 'pageup'], (event) => setRowAndHandleScroll(event, curRow - pageSize));
  Mousetrap.bind(['right', 'pagedown'], (event) => setRowAndHandleScroll(event, curRow + pageSize));
  Mousetrap.bind('home', (event) => setRowAndHandleScroll(event, 0));
  Mousetrap.bind('end', (event) => setRowAndHandleScroll(event, dataSource.length - 1));
  Mousetrap.bind('enter', () => {
    setIsExpanded(!isExpanded);
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
    setDisplayedRow(keyedData[curRow]);
  }, [curRow, keyedData]);

  const setRowAndHandleScroll = useCallback((event: KeyboardEvent, rowNumber: number) => {
    const { row } = setRowNumber(rowNumber);
    handleSelectionScroll({
      event,
      tableRef,
      rowNumber: row,
      pageSize,
    });
  }, [pageSize, setRowNumber]);

  // clean up mouse control when we unmount
  useEffect(() => () => {
    // setCurRow(0);
    // setCurPage(1);
    Mousetrap.unbind(['up', 'down', 'pageup', 'pagedown', 'home', 'end', 'enter']);
  }, []);

  const gridStyle = siderRender ? { display: 'grid', gridTemplateColumns: '225fr 1fr 120fr' } : {};
  const expandedRowRender = expandRender !== undefined
    ? expandRender
    : (row: any) => <pre>{JSON.stringify(row, null, 2)}</pre>;

  return (
    <div ref={tableRef} style={gridStyle}>
      <Table
        onRow={(record) => ({
          onClick: () => {
            setRowNumber(record.key);
          },
          style: record.key === curRow ? { color: 'darkblue', backgroundColor: 'rgb(236, 235, 235)' } : {},
        })}
        size='small'
        loading={loading}
        columns={columns}
        dataSource={keyedData}
        expandable={{
          expandedRowRender,
        }}
        pagination={{
          onChange: (page, newPageSize) => {
            if (newPageSize && newPageSize !== pageSize) {
              setPageSize(newPageSize);
              setRowNumber(0);
            }
          },
          pageSize,
          current: curPage,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
        }}
      />
      <div />
      {siderRender ? siderRender(displayedRow) : <></>}
    </div>
  );
};

// TODO(tjayrush): We used to be able to press enter to open a record's details
