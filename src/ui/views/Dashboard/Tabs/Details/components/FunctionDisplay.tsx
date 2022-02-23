import React from 'react';

import { Function } from '@sdk';
import { Space, Typography } from 'antd';

import { Address } from '@components/Address';
import { DataDisplay } from '@components/DataDisplay';
import { OnValue } from '@modules/tree';

import { isAddress } from '../../../../../Utilities';

//-----------------------------------------------------------------
export const FunctionDisplay = ({ func, rawBytes }: { func: Function, rawBytes: string }) => {
  if (!func && (!rawBytes || rawBytes.length === 0)) return <></>;

  const bytes = {
    function: rawBytes.slice(0, 10),
    rest: rawBytes.replace(rawBytes.slice(0, 10), '')?.match(/.{1,64}/g)?.map((s) => (
      `0x${s}`
    )),
  };

  const onValue: OnValue = (path, value) => {
    if (isAddress(value)) {
      return <Address address={String(value)} />;
    }

    return (
      <span>{value}</span>
    );
  };

  const { Title } = Typography;
  return (
    <Space direction='vertical' size='middle'>
      { func
        ? (
          <div>
            <Title level={5}>Details</Title>
            <DataDisplay data={func} onValue={onValue} />
          </div>
        )
        : null}

      { rawBytes !== '0x'
        ? (
          <div>
            <Title level={5}>Bytes</Title>
            <DataDisplay data={bytes} onValue={onValue} showCopy={false} />
          </div>
        )
        : null}
    </Space>
  );
};
