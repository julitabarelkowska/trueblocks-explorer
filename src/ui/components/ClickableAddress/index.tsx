import React from 'react';
import { useHistory } from 'react-router-dom';

import { address as Address } from '@sdk';
import { Button } from 'antd';

import { DashboardAccountsAddressLocation } from '../../Routes';
import { useGlobalState } from '../../State';

type ClickableAddressProps = {} & {
  name: string,
  address: Address,
};

export const ClickableAddress = ({ name, address }: ClickableAddressProps) => {
  const history = useHistory();
  const { setCurrentAddress } = useGlobalState();
  return (
    <div>
      <div>{name === '' ? <div style={{ fontStyle: 'italic' }}>not named</div> : name}</div>
      <Button
        type='link'
        style={{ color: '#1890ff', cursor: 'pointer' }}
        onClick={() => {
          setCurrentAddress(address);
          history.push(DashboardAccountsAddressLocation(address));
        }}
      >
        {address}
      </Button>
    </div>
  );
};
