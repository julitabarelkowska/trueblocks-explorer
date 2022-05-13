import React, { useMemo } from 'react';

import {
  PageHeader,
  Progress,
} from 'antd';

import { useGlobalNames, useGlobalState } from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';

import './AddressBar.css';

export const AddressBar = ({ params }: { params: AccountViewParams }) => {
  const { currentAddress, chain } = useGlobalState();
  const { namesMap } = useGlobalNames();
  const { totalRecords } = params;

  const title = useMemo(() => {
    const name = currentAddress ? namesMap.get(currentAddress)?.name : '';

    if (!name) {
      return <PageHeader title={currentAddress} />;
    }

    return <PageHeader title={name} subTitle={currentAddress} />;
  }, [currentAddress, namesMap]);

  if (!namesMap || !currentAddress) return <></>;

  return (
    <div className='addressBar'>
      <div className='topRow'>
        {title}
        <div>
          <ProgressBar params={params} />
        </div>
      </div>
      <div />
      <div>{`${totalRecords} records on ${chain.chain}`}</div>
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
