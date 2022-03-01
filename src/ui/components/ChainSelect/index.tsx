import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useGlobalState } from '@state';
import { Select } from 'antd';

// TODO: BOGUS - list of configured chains
const chainList = ['mainnet', 'gnosis', 'rinkeby', 'sepolia'];
export function ChainSelect() {
  const history = useHistory();
  const { chain, setChain } = useGlobalState();

  const onChainChange = useCallback((newValue) => {
    // Clear transactions filters (if any)
    history.push(history.location.pathname);
    setChain(newValue);
  }, [history, setChain]);

  return (
    <Select
      placeholder='chain'
      value={chain}
      onChange={onChainChange}
      style={{ width: '10vw' }}
    >
      {chainList.map((item) => (
        <Select.Option key={item} value={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
}
