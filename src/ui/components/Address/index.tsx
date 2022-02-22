import React from 'react';
import { Link } from 'react-router-dom';

import { CopyTwoTone } from '@ant-design/icons';
import { useGlobalState } from '@state';
import { Button } from 'antd';

import { DashboardAccountsLocation } from '../../Routes';

export const Address = (
  { address, showCopy = true, link = false }: { address: string, showCopy?: boolean, link?: boolean },
) => {
  const { namesMap: names } = useGlobalState();
  const linkComponent = (
    <Link to={{
      pathname: DashboardAccountsLocation, search: String(new URLSearchParams({ address: String(address) })),
    }}
    >
      {address}
    </Link>
  );

  return (
    <>
      { link ? linkComponent : <span>{address}</span>}
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
  link: false,
};
