import React, { useEffect, useState } from 'react';

import { ColumnsType } from 'antd/lib/table';

import { addColumn, addNumColumn, BaseTable } from '@components/Table';

type Context = {
  type: string,
  color: string,
  lineType: string
}
type handlerFunc = React.Dispatch<React.SetStateAction<Context>>;

type ChartContext = {
  data: any[],
  ctx: Context,
  handler: handlerFunc,
}

export const IndexCharts = ({
  theData,
  title,
  loading,
}: {
  theData: any[]
  title: string | JSX.Element
  loading: boolean
}) => {
  const [ctx, setCtx] = useState({ type: 'line', color: 'blue', lineType: 'solid' } as Context);
  const [chart, setChart] = useState({ data: theData, ctx, handler: setCtx } as ChartContext);

  const schema: ColumnsType<any> = [
    addNumColumn({
      title: 'X',
      dataIndex: 'aa',
      configuration: {
        render: (item) => 12,
        width: '200px',
      },
    }),
    addNumColumn({
      title: 'Y',
      dataIndex: 'bb',
      configuration: {
        render: (item) => 22,
        width: '200px',
      },
    }),
  ];

  return (
    <div style={{
      justifyItems: 'center',
      width: '80%',
      backgroundColor: 'grey',
      border: '2px solid black',
      display: 'grid',
      gridTemplateColumns: '2fr 4fr 20fr 3fr 2fr',
    }}
    >
      <div />
      <div><Controls ctx={ctx} handler={setCtx} /></div>
      <div>{theData.length}</div>
      <div style={{ backgroundColor: 'orange' }}>
        <BaseTable dataSource={theData} columns={schema} loading={loading} defPageSize={12} />
      </div>
      <div />
    </div>
  );
};

const Controls = ({
  ctx,
  handler,
}: {
  ctx: Context,
  handler: handlerFunc
}) => (
  <div>
    <div style={{ width: '100%', backgroundColor: 'white' }}>
      <div>{`type: ${ctx.type}`}</div>
      <div>{`color: ${ctx.color}`}</div>
      <div>{`lineType: ${ctx.lineType}`}</div>
    </div>
  </div>
);

// const BarChart = () => (<div>X</div>);

// export const ChartCanvas = forwardRef((props, ref) => {
//     const {
//         width,
//         height,
//         margin,
//         children
//     } = props;

//     return (
//         <div className="at-row chart">
//             <svg width={width} height={height} ref={ref}>
//                 <g transform={`translate(${margin.left},${margin.top})`}>
//                     {children}
//                 </g>
//             </svg>
//         </div>
//     );
// });

// /*-------------------------------------------------------------------------
//  * This source code is confidential proprietary information which is
// import React, { useState, useCallback } from 'react';
// import { scaleLinear } from 'd3-scale';
// import { extent } from 'd3-array';

// import { Tablebar, DataTable } from 'components';
// import { calcValue } from 'components/utils';

// import { LineChart } from './Charts/Line';
// import { BarChart } from './Charts/Bar';
// import { ScatterChart } from './Charts/Scatter';

// import './ChartTable.css';

// //-----------------------------------------------------------------
// export const ChartTable = ({
//   data,
//   columns,
//   title = 'Chart Table (ct-)',
//   chartName = '',
//   chartCtx = { defPair: ['none', 'none'] },
// }) => {
//   const [range, setRange] = useState(localStorage.getItem(chartName + '-range') || chartCtx.defPair[0]);
//   const [domain, setDomain] = useState(localStorage.getItem(chartName + '-domain') || chartCtx.defPair[1]);
//   const [radius, setRadius] = useState(localStorage.getItem(chartName + '-radius') || chartCtx.radius || 2);
//   const [type, setType] = useState(localStorage.getItem(chartName + '-type') || chartCtx.type || '');
//   const chartHandler = useCallback(
//     (which, value) => {
//       switch (which) {
//         case 'setType':
//           setType(value);
//           localStorage.setItem(chartName + '-type', value);
//           break;
//         case 'setRange':
//           setRange(value);
//           localStorage.setItem(chartName + '-range', value);
//           break;
//         case 'setDomain':
//           setDomain(value);
//           localStorage.setItem(chartName + '-domain', value);
//           break;
//         case 'setRadius':
//           setRadius(value);
//           localStorage.setItem(chartName + '-radius', value);
//           break;
//         case 'flip':
//           const r = range;
//           const d = domain;
//           localStorage.setItem(chartName + '-range', d);
//           setRange(domain);
//           localStorage.setItem(chartName + '-domain', r);
//           setDomain(r);
//           break;
//         default:
//           break;
//       }
//     },
//     [chartName, domain, range]
//   );

//   const chartCtx2 = {
//     ...chartCtx,
//     type: type,
//     range: range,
//     domain: domain,
//     radius: radius,
//     handler: chartHandler,
//     rangeCol: columns.filter((column) => {
//       return column.selector === range;
//     })[0],
//     domainCol: columns.filter((column) => {
//       return column.selector === domain;
//     })[0],
//   };

//   if (!(chartCtx2.domainCol && chartCtx2.rangeCol)) return <div>Chart not properly initialized</div>;

//   const theTitle = title !== '' ? title : chartCtx2.domainCol.name + ' as a function of ' + chartCtx2.rangeCol.name;
//   return (
//     <div style={{ display: 'inline' }}>
//       <Tablebar title={theTitle} search={false} pagination={false} handler={chartHandler} />
//       <div
//         style={{
//           display: 'grid',
//           gridTemplateColumns: '2fr 2fr minmax(auto, ' + w + 'px) 2fr 2fr',
//           paddingTop: '8px',
//         }}
//         className="at-body"
//       >
//         <div></div>
//         <Controls data={data} columns={columns} chartCtx={chartCtx2} />
//         <ChartChart data={data} columns={columns} chartCtx={chartCtx2} />
//         <ChartDataTable data={data} columns={columns} chartCtx={chartCtx2} />
//         <div></div>
//       </div>
//     </div>
//   );
// };

// //-----------------------------------------------------------------
// function ChartChart({ data, columns, chartCtx }) {
//   chartCtx.width = w - margin.right - margin.left;
//   chartCtx.height = h - margin.top - margin.bottom;
//   console.log('x domain', extent(data, (d) => calcValue(d, chartCtx.rangeCol)));
//   chartCtx.xScale = scaleLinear()
//     .domain(extent(data, (d) => calcValue(d, chartCtx.rangeCol)))
//     .range([0, chartCtx.width]);
//   chartCtx.yScale = scaleLinear()
//     .domain(extent(data, (d) => calcValue(d, chartCtx.domainCol)))
//     .range([chartCtx.height, 0]);
//   switch (chartCtx.type) {
//     case 'scatter':
//       return (
//         <ScatterChart data={data} columns={columns} chartCtx={chartCtx} margin={margin} width={w} height={h}>
//           <YAxis chartCtx={chartCtx} />
//           <XAxis chartCtx={chartCtx} />
//         </ScatterChart>
//       );
//     case 'line':
//       return (
//         <LineChart data={data} columns={columns} chartCtx={chartCtx} margin={margin} width={w} height={h}>
//           <YAxis chartCtx={chartCtx} />
//           <XAxis chartCtx={chartCtx} />
//         </LineChart>
//       );
//     case 'bar':
//       return (
//         <BarChart data={data} columns={columns} chartCtx={chartCtx} margin={margin} width={w} height={h}>
//           <YAxis chartCtx={chartCtx} />
//           <XAxis chartCtx={chartCtx} />
//         </BarChart>
//       );
//     default:
//       return 'Unknown chart type ' + chartCtx.type;
//   }
// }
// //-----------------------------------------------------------------
// const YAxis = ({ chartCtx }) => {
//   const axis = chartCtx.yScale.ticks(5).map((tick, i) => {
//     const scaledTick = chartCtx.yScale(tick);
//     return (
//       <g key={i} className="y-tick">
//         <line style={{ stroke: '#e4e5eb' }} x1={0} y1={scaledTick} x2={chartCtx.width} y2={scaledTick} />
//         <text style={{ fontSize: 12 }} x={-25} y={scaledTick} dy=".32em">
//           {tick}
//         </text>
//       </g>
//     );
//   });
//   return <>{axis}</>;
// };
// //-----------------------------------------------------------------
// function XAxis({ chartCtx }) {
//   const axis = chartCtx.xScale.ticks(5).map((d, i) => (
//     <g className="x-tick" key={i}>
//       <line x1={chartCtx.xScale(d)} y1={0} x2={chartCtx.xScale(d)} y2={chartCtx.height} style={{ stroke: '#e4e5eb' }} />
//       <text dy=".71em" x={chartCtx.xScale(d)} y={chartCtx.height + 10} style={{ textAnchor: 'middle', fontSize: 12 }}>
//         {d}
//       </text>
//     </g>
//   ));
//   return <>{axis}</>;
// }
// //-----------------------------------------------------------------
// const w = 800;
// const h = 800;
// const margin = {
//   top: 40,
//   bottom: 40,
//   left: 40,
//   right: 40,
// };
// //-----------------------------------------------------------------
// const ChartDataTable = ({ data, columns, chartCtx }) => {
//   const idCol = {
//     width: 1,
//     name: 'ID',
//     selector: 'id',
//     hidden: true,
//     onDisplay: (record, fieldName) => '12',
//   };
//   let dtCols = [idCol, chartCtx.rangeCol, chartCtx.domainCol];
//   dtCols[1].hidden = false;
//   dtCols[1].width = 1;
//   dtCols[2].hidden = false;
//   dtCols[2].width = 1;
//   return (
//     <div>
//       <DataTable
//         name="chartSideTable"
//         style={{ justifySelf: 'center' }}
//         data={data}
//         columns={dtCols}
//         title=""
//         search={false}
//         pagination={true}
//         paginationParts="arrows-only"
//       />
//     </div>
//   );
// };
// //-----------------------------------------------------------------
// const Controls = ({ data, columns, chartCtx }) => {
//   const getStyle = (which, field) => {
//     if (which !== 'range' && which !== 'domain' && which !== 'type') return 'notSelected';
//     if (which === 'type') {
//       return field === chartCtx.type ? 'selected' : 'notSelected';
//     }
//     return which === 'range'
//       ? field === chartCtx.range
//         ? 'selected'
//         : 'notSelected'
//       : field === chartCtx.domain
//       ? 'selected'
//       : 'notSelected';
//   };
//   const getButton = (which, column) => {
//     const key = which + '_' + (column && column.selector);
//     if (which === 'range') {
//       return (
//         <button
//           key={key}
//           className={getStyle(which, column.selector)}
//           onClick={() => chartCtx.handler('setRange', column.selector)}
//         >
//           {column.name + (column.onDisplay ? '*' : '')}
//         </button>
//       );
//     } else if (which === 'domain') {
//       return (
//         <button
//           key={key}
//           className={getStyle(which, column.selector)}
//           onClick={() => chartCtx.handler('setDomain', column.selector)}
//         >
//           {column.name + (column.onDisplay ? '*' : '')}
//         </button>
//       );
//     } else if (which === 'type') {
//       return (
//         <button
//           key={key}
//           className={getStyle('type', column.selector)}
//           onClick={() => chartCtx.handler('setType', column.selector)}
//         >
//           {column.name}
//         </button>
//       );
//     } else if (which === 'radius') {
//       return (
//         <button
//           key={key}
//           className={getStyle(which, '')}
//           onClick={() => chartCtx.handler('setRadius', (chartCtx.radius + 1) % 8)}
//         >
//           radius: {chartCtx.radius}
//         </button>
//       );
//     } else if (which === 'flip') {
//       return (
//         <button key={key} className={getStyle(which, '')} onClick={() => chartCtx.handler('flip', 0)}>
//           flip
//         </button>
//       );
//     } else {
//       return <div>Unknown type</div>;
//     }
//   };
//   const scatter = { name: 'Scatter', selector: 'scatter' };
//   const line = { name: 'Line', selector: 'line' };
//   const bar = { name: 'Bar', selector: 'bar' };
//   return (
//     <div>
//       <h4>Type: </h4>
//       {getButton('type', scatter)}
//       {getButton('type', line)}
//       {getButton('type', bar)}
//       <br />
//       <br />
//       <h4>Range: </h4>
//       {columns.map((column, index) => {
//         if (column.chart === 'range' || column.chart === 'both') return getButton('range', column);
//         return '';
//       })}
//       <br />
//       <br />
//       <h4>Domain: </h4>
//       {columns.map((column, index) => {
//         if (column.chart === 'domain' || column.chart === 'both') return getButton('domain', column);
//         return '';
//       })}
//       {'* - functional columns'}
//       <br />
//       <br />
//       <h4>Settings: </h4>
//       <div>{getButton('radius')}</div>
//       <div>{getButton('flip')}</div>
//     </div>
//   );
// };

// /*-------------------------------------------------------------------------
//  * This source code is confidential proprietary information which is
// import React, { useRef, useEffect } from 'react';

// import {
//     select,
//     scaleBand,
//     // transition,
//     // easeCubicIn,
// } from 'd3';

// import { calcValue } from 'components/utils';

// import './Bar.css';

// import { ChartCanvas } from './ChartCanvas';

// export const BarChart = (props) => {
//     const {
//         data,
//         chartCtx,
//         margin
//     } = props;
//     const chartCanvas = useRef();

//     useEffect(() => {
//         const { yScale } = chartCtx;
//         const svg = select(chartCanvas.current);

//         const xScale = scaleBand()
//             .domain(data.map(d => calcValue(d, chartCtx.rangeCol)))
//             .range([0, chartCtx.width])
//             .padding(0.5)

//         const yValue = (value) => yScale(calcValue(value, chartCtx.domainCol));

//         svg
//             .selectAll('.bar')
//             .data(data)
//             .join('rect')
//             .attr('x', (value) => xScale(calcValue(value, chartCtx.rangeCol)))
//             .attr('y', yValue)
//             .attr('height', (value) => chartCtx.height - yValue(value))
//             // .attr('y', chartCtx.height)
//             // .attr('height', 0)
//             .attr('width', xScale.bandwidth())
//             .attr('class', 'bar')
//             .attr('transform', `translate(${margin.left}, ${margin.top})`)
//             .on('mouseenter', function () {
//                 select(this).classed('hover', true);
//             })
//             .on('mouseleave', function () {
//                 select(this).classed('hover', false);
//             })
//         // .transition()
//         // .duration(750)
//         // .ease(easeCubicIn)
//         // .attr('height', (value) => chartCtx.height - yValue(value))
//         // .attr('y', yValue);
//     }, [data, chartCtx, margin]);

//     return (
//         <ChartCanvas ref={chartCanvas} {...props}>
//             {props.children}
//         </ChartCanvas>
//     );
// };

// /*-------------------------------------------------------------------------
//  * This source code is confidential proprietary information which is
// import {
//     curveBasis,
//     line,
//     select,
// } from 'd3';

// import { calcValue } from 'components/utils';

// import { ChartCanvas } from './ChartCanvas';
// import './Line.css';

// export const LineChart = (props) => {
//     const {
//         data,
//         chartCtx,
//         margin
//     } = props;
//     const chartCanvas = useRef();

//     useEffect(() => {
//         const svg = select(chartCanvas.current);
//         const chartLine = line()
//             .x((value) => chartCtx.xScale(calcValue(value, chartCtx.rangeCol)))
//             .y((value) => chartCtx.yScale(calcValue(value, chartCtx.domainCol)))
//             .curve(curveBasis);

//         svg
//             .selectAll('.line')
//             .data([data])
//             .join('path')
//             .attr('class', 'line')
//             .attr('d', chartLine)
//             .attr('transform', `translate(${margin.left}, ${margin.top})`);
//     }, [data, chartCtx, margin]);

//     return (
//         <ChartCanvas ref={chartCanvas} {...props}>
//             {props.children}
//         </ChartCanvas>
//     );
// };
// /*-------------------------------------------------------------------------
//  * This source code is confidential proprietary information which is
// import React, { useRef, useEffect } from 'react';

// import {
//     select,
// } from 'd3';

// import { calcValue } from 'components/utils';

// import './Scatter.css';

// import { ChartCanvas } from './ChartCanvas';

// export const ScatterChart = (props) => {
//     const {
//         data,
//         chartCtx,
//         margin
//     } = props;
//     const chartCanvas = useRef();

//     useEffect(() => {
//         const { xScale, yScale } = chartCtx;
//         const svg = select(chartCanvas.current);

//         svg
//             .selectAll('.scatter')
//             .data(data)
//             .join('circle')
//             .attr('cx', (value) => xScale(calcValue(value, chartCtx.rangeCol)))
//             .attr('cy', (value) => yScale(calcValue(value, chartCtx.domainCol)))
//             .attr('r', 2)
//             .attr('class', 'point')
//             .attr('transform', `translate(${margin.left}, ${margin.top})`)
//     }, [data, chartCtx, margin]);

//     return (
//         <ChartCanvas ref={chartCanvas} {...props}>
//             {props.children}
//         </ChartCanvas>
//     );
// };
