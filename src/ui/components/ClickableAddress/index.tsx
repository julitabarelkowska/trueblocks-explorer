import React from 'react';
import { generatePath, Link } from 'react-router-dom';

import { address as Address } from 'trueblocks-sdk';

import { DashboardAccountsAddressLocation } from '../../Routes';

type ClickableAddressProps = {} & {
  name: string,
  address: Address,
};

export const ClickableAddress = ({ name, address }: ClickableAddressProps) => (
  <div>
    <div>{name === '' ? <div style={{ fontStyle: 'italic' }}>not named</div> : name}</div>
    <Link
      to={generatePath(DashboardAccountsAddressLocation, { address })}
    >
      {address}
    </Link>
  </div>
);
