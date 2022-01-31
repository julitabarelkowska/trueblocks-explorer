import React from 'react';
import { createUseStyles } from 'react-jss';

import { Function } from '@sdk';

//-----------------------------------------------------------------
export const FunctionDisplay = ({ func, rawBytes }: { func: Function, rawBytes: string }) => {
  const styles = useStyles();

  if (!func) return <></>;

  const thing = (
    <table style={{ width: '100%' }}>
      {Object.entries(func).map(
        ([name, value]) => {
          if (name === 'name') {
            return (
              <tr key={name}>
                <td colSpan={3} className={styles.header} key={1}>{`Function: ${value}`}</td>
              </tr>
            );
          }
          return (
            <>
              {Object.entries(value).map(([key, val]) => (
                <tr key={`${name}2`}>
                  <td key={`${name}1`} style={{ width: '1%' }} />
                  <td style={{ fontWeight: 'bold', width: '20%' }} key={`${name}2`}>{`${key}:`}</td>
                  <td key={`${name}3`}>{`${val}`}</td>
                </tr>
              ))}
            </>
          );
        },
      )}
    </table>
  );
  const articulated = (
    <pre style={{ overflowX: 'hidden' }}>
      {thing}
      <br />
    </pre>
  );

  const bytes = (
    <pre>
      <div>{rawBytes.slice(0, 10)}</div>
      {rawBytes.replace(rawBytes.slice(0, 10), '')?.match(/.{1,64}/g)?.map((s, index) => (
        <div key={`${s + index}`}>
          {`0x${s}`}
        </div>
      ))}
    </pre>
  );

  return (
    <div>
      {articulated}
      <div className={styles.header}>
        Bytes:
      </div>
      {bytes}
      <br />
    </div>
  );
};

//-----------------------------------------------------------------
const useStyles = createUseStyles({
  header: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
});
