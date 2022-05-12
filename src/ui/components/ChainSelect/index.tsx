import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Status } from '@sdk';
import { useGlobalState } from '@state';
import { Select } from 'antd';

export function ChainSelect({ status }: { status: Status }) {
  const history = useHistory();
  const { chain, setChain } = useGlobalState();

  const onChainChange = useCallback((newValue: string) => {
    // Clear transactions filters (if any)
    history.push(history.location.pathname);

    const newChain = status.chains.find(({ chain: chainName }) => chainName === newValue);
    if (!newChain) {
      throw new Error(`Chain configuration not found for: "${newValue}"`);
    }

    setChain(newChain);
  }, [history, setChain, status.chains]);

  const chains = useMemo(() => status.chains.map(({ chain: chainName }) => chainName), [status.chains]);

  return (
    <Select
      placeholder='chain'
      value={chain.chain}
      onChange={onChainChange}
      style={{ width: '10vw' }}
    >
      {chains.map((chainName) => (
        <Select.Option key={chainName} value={chainName}>
          {chainName}
        </Select.Option>
      ))}
    </Select>
  );
}
