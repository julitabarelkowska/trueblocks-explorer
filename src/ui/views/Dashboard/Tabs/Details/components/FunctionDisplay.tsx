import React from 'react';
import { createUseStyles } from 'react-jss';

import { Function } from '@sdk';

//-----------------------------------------------------------------
export const FunctionDisplay = ({ func, rawBytes }: { func: Function, rawBytes: string }) => {
  const styles = useStyles();

  if (!func) return <></>;

  // TODO: This hugely horrible thing is temporary -- the real one has to handle irrelevant
  // TODO: parameters and tuple parameters
  const thing = (
    <table style={{ width: '100%' }}>
      <tbody>
        {Object.entries(func).map(
          ([name, value]) => {
            if (name === 'name') {
              return (
                <tr key={`${name}1`}>
                  <td colSpan={3} className={styles.header} key={1}>{`Function: ${value}`}</td>
                </tr>
              );
            }
            return (
              <>
                {Object.entries(value).map(([key, val]) => (
                  <tr key={`${key}2`}>
                    <td key={`${name}11`} style={{ width: '1%' }} />
                    <td key={`${name}12`} style={{ fontWeight: 'bold', width: '20%' }}>{`${key}:`}</td>
                    <td key={`${name}13`}>{`${val}`}</td>
                  </tr>
                ))}
              </>
            );
          },
        )}
      </tbody>
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
