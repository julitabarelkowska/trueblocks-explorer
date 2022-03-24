import React, {
  useCallback, useEffect, useState,
} from 'react';
import { Link } from 'react-router-dom';

import { GetChartItemsResult, LoadTransactionsStatus } from 'src/ui/datastore/messages';

import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { usePathWithAddress } from '@hooks/paths';
import { useDatastore } from '@hooks/useDatastore';
import { createWrapper } from '@hooks/useSearchParams';

// FIXME: these look like UI-related types
import { DashboardAccountsHistoryLocation } from '../../../../../Routes';
import { useGlobalNames, useGlobalState, useGlobalState2 } from '../../../../../State';
import { chartColors } from '../../../../../Utilities';
import { AccountViewParams } from '../../../Dashboard';

export const Charts = ({ params }: { params: Omit<AccountViewParams, 'theData'> }) => {
  const {
    userPrefs,
  } = params;
  const {
    hideZero,
  } = userPrefs;
  const {
    denom,
    currentAddress,
    transactionsLoaded,
  } = useGlobalState();

  const {
    onMessage,
    getChartItems,
  } = useDatastore();

  const [items, setItems] = useState<GetChartItemsResult>([]);

  const getCurrentChartItems = useCallback(() => {
    if (!currentAddress) return;

    if (!transactionsLoaded) return;

    getChartItems({
      address: currentAddress,
      // TODO: typecast
      denom: denom as 'ether' | 'dollars',
      zeroBalanceStrategy: (() => {
        if (hideZero === 'all') return 'unset';
        if (hideZero === 'show') return 'ignore-non-zero';
        return 'ignore-zero';
      })(),
    });
  }, [currentAddress, denom, getChartItems, hideZero, transactionsLoaded]);

  useEffect(() => getCurrentChartItems(), [getCurrentChartItems]);

  useEffect(() => onMessage<GetChartItemsResult>('getChartItems', (message) => {
    setItems(message.result);
  }), [onMessage]);

  useEffect(() => onMessage<LoadTransactionsStatus>('loadTransactions', () => {
    getCurrentChartItems();
  }), [getCurrentChartItems, onMessage]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
      {items.map((asset, index: number) => {
        const color = asset.assetSymbol === 'ETH'
          ? '#63b598'
          : chartColors[Number(`0x${asset.assetAddress.substr(4, 3)}`) % chartColors.length];
        const columns: any[] = [
          addColumn({
            title: 'Date',
            dataIndex: 'date',
          }),
          addColumn({
            title: asset.assetAddress,
            dataIndex: asset.assetAddress,
          }),
        ];

        return (
          <MyAreaChart
            items={asset.items}
            columns={columns}
            key={asset.assetAddress}
            index={asset.assetAddress}
            title={<ChartTitle asset={asset} index={index} />}
            table={false}
            color={color}
          />
        );
      })}
    </div>
  );
};

// TODO: BOGUS -- per chain data
export function getLink(chain: string, type: string, addr1: string, addr2?: string) {
  if (type === 'uni') {
    return `https://info.uniswap.org/#/tokens/${addr1}`;
  }

  if (chain === 'gnosis') {
    if (type === 'token') {
      return `https://blockscout.com/xdai/mainnet/address/${addr1}`;
    } if (type === 'holding') {
      return `https://blockscout.com/xdai/mainnet/address/${addr1}`;
    }
  } else {
    if (type === 'token') {
      return `https://etherscan.io/address/${addr1}`;
    } if (type === 'holding') {
      return `https://etherscan.io/token/${addr1}?a=${addr2}`;
    }
  }
  return '';
}

const ChartTitle = ({ index, asset }: { asset: GetChartItemsResult[0]; index: number }) => {
  const { namesMap } = useGlobalNames();
  const { currentAddress, chain } = useGlobalState();
  const { apiProvider } = useGlobalState2();
  const generatePathWithAddress = usePathWithAddress();

  const links = [];
  links.push(
    <Link to={
      ({ search }) => {
        const path = generatePathWithAddress(DashboardAccountsHistoryLocation);
        return `${path}?${createWrapper(search).set('asset', asset.assetAddress)}`;
      }
    }
    >
      History
    </Link>,
  );
  if (!namesMap.get(asset.assetAddress)) {
    links.push(
      <a target='_blank' href={`${apiProvider}/names?chain=${chain}&autoname=${asset.assetAddress}`} rel='noreferrer'>
        Name
      </a>,
    );
  }
  if (asset.assetSymbol !== 'ETH') {
    links.push(
      <a target='_blank' href={getLink(chain, 'holding', asset.assetAddress, currentAddress)} rel='noreferrer'>
        Holdings
      </a>,
    );
  }
  links.push(
    <a target='_blank' href={getLink(chain, 'token', asset.assetAddress, '')} rel='noreferrer'>
      Token
    </a>,
  );
  links.push(
    <a target='_blank' href={getLink(chain, 'uni', asset.assetAddress, '')} rel='noreferrer'>
      Uniswap
    </a>,
  );

  // TODO: Comment from @dszlachta
  // TODO: I think that it would be good to use useMemo here, so we don't have
  // TODO: to perform the lookup when the component re-renders:
  // TODO: const tokenSymbol = useMemo(() => /* lookupHere */, [deps]);
  // TODO: You could then cache namesMap.get(asset.assetAddrs) and
  // TODO: asset.assetSymbol.substr(0, 15) in variables
  const tokenSymbol = namesMap.get(asset.assetAddress)
    ? namesMap.get(asset.assetAddress)?.name?.substr(0, 15) + (asset.assetSymbol
      ? ` (${asset.assetSymbol.substr(0, 15)})`
      : '')
    : asset.assetSymbol.substr(0, 15);

  return (
    <div key={`${index}d1`} style={{ overflowX: 'hidden' }}>
      {asset.assetSymbol === 'ETH' ? asset.assetSymbol : tokenSymbol}
      <br />
      <small>
        (
        {asset.items.length}
        {' '}
        txs)
        {' '}
        <small>
          {links.map((link) => (
            <div key={`${link.props.href}`} style={{ display: 'inline' }}>
              [
              {link}
              ]
              {' '}
            </div>
          ))}
        </small>
      </small>
    </div>
  );
};
