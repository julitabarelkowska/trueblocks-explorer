import React from 'react';
import { Link } from 'react-router-dom';

import { CopyTwoTone } from '@ant-design/icons';
import { useGlobalState } from '@state';
import { Button } from 'antd';

import { DashboardAccountsLocation } from '../../Routes';

export const Address = ({ address, showCopy = true }: { address: string, showCopy?: boolean }) => {
  const { namesMap: names } = useGlobalState();

  return (
    <>
      <Link to={{
        pathname: DashboardAccountsLocation, search: String(new URLSearchParams({ address: String(address) })),
      }}
      >
        {address}
      </Link>
      { showCopy
        ? (
          <Button
            type='text'
            onClick={() => navigator.clipboard.writeText(String(address))}
          >
            <CopyTwoTone />
          </Button>
        )
        : null}
      <div>
        {names.has(String(address))
          ? names.get(String(address))?.name
          : null}
      </div>
    </>
  );
};

Address.defaultProps = {
  showCopy: true,
};
