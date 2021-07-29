// export const CustomRow = (props: any) => {
//   if (props.className.indexOf('ant-table-expanded-row') >= 0) return <tr {...props} />;
//   else return <tr {...props} tabIndex={0} />;
// };

// export type Selected Row = {
//   curRow: number;
//   curPage: number;
//   pageSize: number;
// };

// export const BaseTable_Old = ({
//   dataSource,
//   columns,
//   loading,
//   extraData,
//   expandRender = undefined,
//   sider Render = undefined,
// }: {
//   dataSource: JsonResponse;
//   columns: ColumnsType<any>;
//   loading: boolean;
//   extraData?: string;
//   expandRender?: (row: any) => JSX.Element;
//   sider Render?: (record: any, selectedRow: Selected Row) => JSX.Element;
// }) => {
//   const { debug } = useGlobalState();
//   const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.ReactText[]>([]);
//   const [curPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(7);
//   const [curRow, setFocusedRow] = useState(0);

//   const dataSrc = dataSource?.map((item: any, i: number) => {
//     return {
//       id: (i + 1).toString(),
//       extraData: extraData,
//       ...item,
//     };
//   });

//   const { handleOnFocus, handleOnBlur } = useKeyBindings(
//     expandedRowKeys,
//     setExpandedRowKeys,
//     curPage,
//     pageSize,
//     dataSrc?.length,
//     () => {
//       /* nextPage */
//       if (curPage < Math.ceil(dataSrc?.length / pageSize)) {
//         setCurrentPage(curPage + 1);
//         setFocusedRow(0);
//       }
//     },
//     () => {
//       /* prevPage */
//       curPage > 1 && setCurrentPage(curPage - 1);
//       const tr = document.querySelector('tr[data-row-key]');
//       const siblings = getSiblings(tr);
//       setFocusedRow(siblings.length - 1);
//       if (siblings.length > 0) siblings[siblings.length - 1].focus();
//     },
//     () => {
//       /* firstPage */
//       setCurrentPage(1);
//     },
//     () => {
//       /* lastPage */
//       const lastPage = Math.ceil(dataSrc?.length / pageSize);
//       setCurrentPage(lastPage);
//       setFocusedRow(dataSrc?.length - (lastPage - 1) * pageSize - 1);
//     },
//     curRow,
//     (row) => setFocusedRow(row)
//   );

//   useHotkeys(
//     'left,pageup',
//     () => {
//       curPage > 1 && setCurrentPage(curPage - 1);
//       const tr = document.querySelector('tr[data-row-key]');
//       const siblings = getSiblings(tr);
//       if (curPage === 1) {
//         //@ts-ignore
//         tr.focus();
//       } else {
//         setFocusedRow(0);
//         if (siblings?.length) siblings[0].focus();
//       }
//     },
//     [curPage, dataSrc, curRow, setFocusedRow]
//   );

//   useHotkeys(
//     'right,pagedown',
//     () => {
//       curPage < Math.ceil(dataSrc?.length / pageSize) && setCurrentPage(curPage + 1);
//       const tr = document.querySelector('tr[data-row-key]');
//       const siblings = getSiblings(tr);
//       setFocusedRow(0);
//       if (siblings?.length) {
//         siblings[0].focus();
//       }
//     },
//     [curPage, dataSrc, curRow, setFocusedRow]
//   );

//   const components = {
//     body: { row: CustomRow },
//   };

//   useEffect(() => {
//     const tr = document.querySelector('tr[data-row-key]');
//     if (tr) {
//       //@ts-ignore
//       tr.focus();
//     }
//     const siblings = getSiblings(tr);
//     if (
//       siblings &&
//       siblings.length > 0 &&
//       curPage === Math.ceil(dataSrc?.length / pageSize) &&
//       tr?.getAttribute('data-row-key')?.toString() !== siblings.length.toString()
//     ) {
//       siblings[siblings.length - 1].focus();
//     }
//   }, [curPage]);

//   const expandedRowRender =
//     expandRender !== undefined ? expandRender : (row: any) => <pre>{JSON.stringify(row, null, 2)}</pre>;
//   let sider = <></>;
//   let style = { display: 'grid', gridTemplateColumns: '20fr 1fr' };
//   if (dataSrc && sider Render) {
//     let dataRow = pageSize * (curPage - 1) + curRow;
//     const record = dataSrc[Math.max(0, dataRow)];
//     sider = sider Render(record, { pageSize, curPage, curRow });
//     style = { display: 'grid', gridTemplateColumns: '10fr 4fr' };
//   }

//   return (
//     <>
//       <div onFocus={handleOnFocus} onBlur={handleOnBlur} style={style}>
//         <Table<any>
//           rowKey={'id'}
//           components={components}
//           columns={columns}
//           dataSource={dataSrc}
//           loading={loading}
//           pagination={{
//             current: curPage,
//             pageSizeOptions: ['5', '10', '20', '50', '100'],
//             pageSize: pageSize,
//             onChange: (page, newPageSize) => {
//               setCurrentPage(page);
//               if (newPageSize !== pageSize) {
//                 setPageSize(pageSize);
//                 setCurrentPage(1);
//                 const tr = document.querySelector('tr[data-row-key]');
//                 //@ts-ignore
//                 tr.focus();
//               }
//             },
//           }}
//           rowClassName={(record, index) => 'row-' + index}
//           size='small'
//           scroll={{ x: 1300 }}
//           expandable={{
//             onExpandedRowsChange: (expandedRowKeys) => {
//               setExpandedRowKeys(expandedRowKeys);
//             },
//             expandedRowKeys: expandedRowKeys,
//             expandedRowRender: expandedRowRender,
//           }}
//         />
//         {sider}
//       </div>
//       {debug ? <pre>records: {JSON.stringify(dataSource?.length)}</pre> : <></>}
//       {debug ? <pre>{JSON.stringify(dataSource, null, 2)}</pre> : <></>}
//     </>
//   );
// };
