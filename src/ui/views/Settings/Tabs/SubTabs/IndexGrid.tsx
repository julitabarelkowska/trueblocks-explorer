import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { IndexCacheItem } from '@sdk';
import cx from 'classnames';

export const IndexGrid = ({
  theData,
  title,
  loading,
}: {
  theData: IndexCacheItem[];
  title: string | JSX.Element,
  loading: boolean
}) => (
  <>
    {title}
    <GridTable data={theData} />
  </>
);

//-----------------------------------------------------------------
const cols = Array(10)
  .fill(10)
  .map((_, idx) => idx) as any[];

//-----------------------------------------------------------------
export const GridTable = ({
  data,
}: {
  data: IndexCacheItem[];
}) => {
  const [selected, setSelected] = useState(localStorage.getItem('grid-select') || '');
  const meta = { max: 15000000, completed: 14100000 };
  const largest = meta.max;

  const rows = Array(Math.ceil(largest / 1e6))
    .fill(10)
    .map((_, idx) => idx);

  const selectionChanged = (newSelected: string) => {
    setSelected(newSelected);
    localStorage.setItem('grid-select', newSelected);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '4fr 7fr' }}>
      <div>
        <GridHeader />
        <div>
          {rows.map((row) => (
            <GridRow
              key={row}
              row={row}
              meta={meta}
              selected={selected}
              setSelected={selectionChanged}
            />
          ))}
        </div>
      </div>
      <div>
        <DetailTable data={data} cellStart={selected} cellSpan={1e6 / 10} />
      </div>
    </div>
  );
};

//-----------------------------------------------------------------
const GridHeader = () => {
  const colSpan = 1e6 / 10;
  const styles = useStyles();
  return (
    <div className={styles.header}>
      <div> </div>
      {cols.map((n: number, idx: number) => <div key={n * idx}>{Intl.NumberFormat().format(n * colSpan)}</div>)}
    </div>
  );
};

//-----------------------------------------------------------------
const GridRow = ({
  row,
  meta,
  selected,
  setSelected,
}: {
  row: any;
  meta: any;
  selected: any;
  setSelected: any;
}) => {
  const colSpan: number = 1e6 / 10;
  const styles = useStyles();
  return (
    <div className={styles.row}>
      <div className={styles.sider}>
        {row * 1e6}
        :
      </div>
      {cols.map((col: { col: any }) => {
        const x: any = col;
        const cellStart = row * 1e6 + x * colSpan;
        const cellEnd = row * 1e6 + (x + 1) * colSpan;
        let char = '';
        if (meta.completed >= cellEnd) {
          char = '☀';
        } else if (meta.completed >= cellStart) {
          char = '--';
        }
        let cn = styles.incomplete;
        if (selected === cellStart && meta.completed >= cellStart) {
          cn = styles.selected;
        } else if (meta.completed >= cellEnd) {
          cn = styles.complete;
        } else if (meta.completed >= cellStart) {
          cn = styles.partial;
        }
        let handler = () => setSelected(row * 1e6 + x * 1e5);
        if (char === '') handler = () => {};
        return (
          <div key={x} className={cx(styles.cell, cn)} onClick={handler}>
            {char}
          </div>
        );
      })}
    </div>
  );
};

//-----------------------------------------------------------------
export const DetailTable = ({
  data,
  cellStart,
  cellSpan,
}: {
  data: IndexCacheItem[];
  cellStart: any;
  cellSpan: any;
}) => {
  if (cellStart === undefined) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 50fr 1fr',
          justifyItems: 'space between',
        }}
      >
        <div />
        <div
          className='at-body'
          style={{
            borderTop: '0px',
            paddingLeft: '10px',
          }}
        >
          <h4>Click a box to see details</h4>
        </div>
        <div />
      </div>
    );
  }

  const range = { start: cellStart, end: cellStart + cellSpan };
  const filteredData = data.filter((item: IndexCacheItem) => item.firstApp >= range.start && item.firstApp < range.end);
  if (filteredData.length > 200 || cellSpan > 100000) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 50fr 1fr',
          justifyItems: 'space between',
        }}
      >
        <div />
        <div
          className='at-body'
          style={{
            borderTop: '0px',
            paddingLeft: '10px',
          }}
        >
          <h4>Click a box to see details</h4>
        </div>
        <div />
      </div>
    );
  }

  const subtit = `Details: ${
    filteredData.length ? filteredData.length : 'No'
  } completed chunks in block range ${
    range.start
  }-${
    range.end}`;

  const details = ['nAddrs', 'nApps', 'blockRange', 'indexSizeBytes', 'bloomSizeBytes', 'indexHash', 'bloomHash'];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 50fr 1fr',
        justifyItems: 'space between',
      }}
    >
      <div />
      <div
        className='at-body'
        style={{
          borderTop: '0px',
        }}
      >
        <h4>{subtit}</h4>
        <div style={{
          display: 'grid', gridTemplateColumns: '4fr 92 4fr', justifyItems: 'stretch', gridGap: '20px',
        }}
        >
          <div
            style={{
              display: 'flex',
              flexFlow: 'row wrap',
              justifyItems: 'stretch',
              gridGap: '4px',
            }}
          >
            {filteredData.map((record: IndexCacheItem) => (
              <div key={record.firstApp} style={{ padding: '2px', border: '1px solid black' }}>
                <div style={{ fontWeight: 600, backgroundColor: 'lightgrey' }}>
                  {record.filename.replace(/.bin/, '')}
                </div>
                {details.map((field) => {
                  let val = <></>;
                  if (field === 'blockRange') {
                    const dist = record.latestApp - record.firstApp;
                    val = <div style={{ border: '1px black' }}>{dist}</div>;
                  } else {
                    const r = record as any;
                    val = <div style={{ border: '1px black' }}>{r[field]}</div>;
                  }
                  if (field === 'nApps' && record[field] >= 2000000) {
                    val = <div style={{ color: 'blue', fontWeight: 600, border: '1px black' }}>{record[field]}</div>;
                  } else if (field === 'nApps') {
                    val = <div style={{ color: 'red', fontWeight: 600, border: '1px black' }}>{record[field]}</div>;
                  }

                  return (
                    <div key={field} style={{ textAlign: 'right', gridTemplateColumns: '1fr 1fr', display: 'grid' }}>
                      <div style={{ border: '1px black' }}>
                        {`${field}: `}
                      </div>
                      {val}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div />
        </div>
      </div>
      <div />
    </div>
  );
};

const useStyles = createUseStyles({
  header: {
    fontSize: '1em',
    fontFamily: 'Times',
    color: 'black',
    backgroundColor: 'white',
    textAlign: 'center' as 'center',
    padding: 2,
    border: 1,
    borderBottomWidth: '0px',
    borderRadius: '0px 0px 0px 0px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    justifyItems: 'stretch',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    textAlign: 'center' as 'center',
    '&:last-child': { borderBottom: '1px lightgrey solid' },
  },
  cell: {
    fontFamily: 'Times',
    padding: 2,
    paddingRight: 6,
    paddingLeft: 6,
    overflow: 'hidden',
    whiteSpace: 'nowrap' as 'nowrap',
    textOverflow: 'ellipsis',
    borderTop: '1px solid lightgrey',
    borderRight: '1px solid lightgrey',
    display: 'block',
    backgroundColor: 'white',
    '&:hover': { color: 'white', backgroundColor: 'purple' },
  },
  sider: {
    fontSize: '1em',
    fontFamily: 'Times',
    color: 'black',
    backgroundColor: 'white',
    borderRight: '1px solid lightgrey',
    borderLeft: '1px solid lightgrey',
    '&:first-child': { borderTop: '1px lightgrey solid' },
  },
  incomplete: {
    backgroundColor: 'lightgrey',
    '&:hover': { color: 'lightgrey', backgroundColor: 'lightgrey' },
  },
  complete: {
    backgroundColor: 'white',
  },
  partial: {
    background: 'linear-gradient(to right, white 30%, lightgrey 100%)',
    backgroundRepeat: 'repeat',
    borderRadius: '0px 0px 2 2',
    '&:hover': { color: 'black', background: 'linear-gradient(to right, purple 30%, lightgrey 100%)' },
  },
  selected: {
    backgroundColor: 'orange',
    color: 'black',
    padding: '1px',
    '&:hover': { color: 'black', backgroundColor: 'orange' },
  },
});
