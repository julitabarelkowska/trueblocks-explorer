import React, { useCallback, useMemo } from 'react';

import { Function } from '@sdk';
import { Space } from 'antd';

import { Address } from '@components/Address';
import { DataDisplay } from '@components/DataDisplay';
import { OnValue } from '@modules/tree';

import { isAddress } from '../../../../../Utilities';

//-----------------------------------------------------------------
export const FunctionDisplay = ({ func, rawBytes }: { func: Function, rawBytes: string }) => {
  const bytes = useMemo(() => ({
    function: rawBytes ? rawBytes.slice(0, 10) : '',
    rest: rawBytes
      ? rawBytes.replace(rawBytes.slice(0, 10), '')?.match(/.{1,64}/g)?.map((s) => (
        `0x${s}`
      ))
      : [],
  }), [rawBytes]);

  const source = useMemo(() => (
    func
      ? ({
        ...func.inputs,
        Outputs: func.outputs,
        Bytes: [
          bytes.function,
          ...(bytes.rest ? bytes.rest : []),
        ],
      })
      : {}
  ), [bytes.function, bytes.rest, func]);

  const onValue: OnValue = useCallback((path, node) => {
    if (node.kind === 'tooDeep') return <></>;

    const { value } = node;

    if (isAddress(value)) {
      return <Address address={String(value)} />;
    }

    if (!value) return <></>;

    return (
      <span>{value}</span>
    );
  }, []);

  if (!func && !rawBytes) return <></>;

  return (
    <Space direction='vertical' size='middle'>
      { func
        ? (
          <div>
            <DataDisplay data={source} onValue={onValue} />
          </div>
        )
        : null}
    </Space>
  );
};
