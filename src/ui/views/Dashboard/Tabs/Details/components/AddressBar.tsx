import React from 'react';

import {
  Progress,
} from 'antd';

import { useGlobalNames, useGlobalState } from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';

import './AddressBar.css';

export const AddressBar = ({ params }: { params: AccountViewParams }) => {
  const { currentAddress, chain } = useGlobalState();
  const { namesMap } = useGlobalNames();
  const { totalRecords } = params;

  if (!namesMap || !currentAddress) return <></>;
  if (namesMap.get(currentAddress)?.name === undefined) return <></>;

  return (
    <div className='address_bar'>
      <h3>
        {`${namesMap.get(currentAddress)?.name} (${currentAddress})`}
      </h3>
      <div>
        <ProgressBar params={params} />
      </div>
      <div />
      <div style={{ marginTop: '0px' }}>{`${totalRecords} records on ${chain}`}</div>
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
