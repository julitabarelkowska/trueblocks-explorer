import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { CopyTwoTone } from '@ant-design/icons';
import { Button } from 'antd';

import { useName } from '@hooks/useName';

import { DashboardAccountsLocation } from '../../Routes';

export const Address = (
  { address, showCopy = true, link = false }: { address: string, showCopy?: boolean, link?: boolean },
) => {
  const [name, setName] = useState('');

  useName(
    [address],
    ([nameFound]) => setName(nameFound?.name || ''),
  );

  let addr = address;
  if (addr && addr.length === 66) {
    addr = `0x${addr.substr(26, 66)}`;
  }

  const linkComponent = (
    <Link to={{
      pathname: DashboardAccountsLocation, search: String(new URLSearchParams({ address: String(addr) })),
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
            onClick={() => navigator.clipboard.writeText(String(addr))}
          >
            <CopyTwoTone />
          </Button>
        )
        : null}
      <div>
        {name}
      </div>
    </>
  );
};

Address.defaultProps = {
  showCopy: true,
  link: false,
};
