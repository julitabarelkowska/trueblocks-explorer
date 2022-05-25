import React, { useMemo, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { useGlobalState } from '@state';
import {
  PageHeader,
  Progress,
} from 'antd';

import { usePathWithAddress } from '@hooks/paths';
import { useName } from '@hooks/useName';

import { DashboardAccountsAddressLocation } from '../../../../../Routes';
import { AccountViewParams } from '../../../Dashboard';

import './AddressBar.css';

export const AddressBar = ({ params, filtersActive }: { params: AccountViewParams, filtersActive: boolean }) => {
  const {
    currentAddress,
    chain,
    totalRecords,
    filteredRecords,
  } = useGlobalState();
  const generatePathWithAddress = usePathWithAddress();
  const [name, setName] = useState('');

  useName(
    [String(currentAddress)],
    ([nameFound]) => setName(nameFound?.name || ''),
  );

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
      <Switch>
        <Route exact path={generatePathWithAddress(DashboardAccountsAddressLocation)}>
          {totalRecords}
          {' '}
          records on
          {' '}
          {chain}
        </Route>
        <Route>
          {filtersActive ? filteredRecords : totalRecords}
          {' '}
          records
          {' '}
          {filtersActive ? 'matching filters on' : 'on'}
          {' '}
          {chain}
        </Route>
      </Switch>
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
