import React, { useMemo, useState } from 'react';

import { useGlobalState } from '@state';
import {
  PageHeader,
  Progress,
} from 'antd';

import { useName } from '@hooks/useName';

import { AccountViewParams } from '../../../Dashboard';

import './AddressBar.css';

export const AddressBar = ({ params }: { params: AccountViewParams }) => {
  const { currentAddress, chain } = useGlobalState();
  const [name, setName] = useState('');

  useName(
    [String(currentAddress)],
    ([nameFound]) => setName(nameFound?.name || ''),
  );

  const { totalRecords } = params;
  const title = useMemo(() => {
    if (!name) {
      return <PageHeader title={currentAddress} />;
    }

    return <PageHeader title={name} subTitle={currentAddress} />;
  }, [currentAddress, name]);

  if (!currentAddress) return <></>;

  return (
    <div className='addressBar'>
      <div className='topRow'>
        {title}
        <div>
          <ProgressBar params={params} />
        </div>
      </div>
      <div />
      <div>{`${totalRecords} records on ${chain}`}</div>
    </div>
  );
};

const ProgressBar = ({ params }: { params: AccountViewParams }): JSX.Element => {
  const { theData, totalRecords } = params;
  if (!theData) return <></>;
  if (!totalRecords) return <></>;

  if (
    !theData
    || !totalRecords
    || theData.length === totalRecords
    || (totalRecords - theData.length) === 1
  ) return <></>;

  const pct = Math.floor((theData.length / (totalRecords || 1)) * 100);
  return (
    <div>
      <Progress percent={pct} strokeLinecap='square' />
    </div>
  );
};
