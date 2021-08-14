import { DashboardAccountsAddressLocation } from '../../Routes';
import useGlobalState from '../../State';
import { address } from '@modules/types';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const renderClickableAddress = (name: string, address: address) => {
  const history = useHistory();
  const { setCurrentAddress } = useGlobalState();
  return (
    <div>
      <div>{name === '' ? <div style={{ fontStyle: 'italic' }}>not named</div> : name}</div>
      <div
        style={{ color: '#1890ff', cursor: 'pointer' }}
        onClick={() => {
          setCurrentAddress(address);
          history.push(DashboardAccountsAddressLocation(address));
        }}>
        {address}
      </div>
    </div>
  );
};
