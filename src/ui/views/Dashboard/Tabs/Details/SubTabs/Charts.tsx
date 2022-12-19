import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Link } from 'react-router-dom';

import { useGlobalState, useGlobalState2 } from '@state';
import { GetChartItemsResult } from 'src/ui/datastore/messages';
import { Chain, Name } from 'trueblocks-sdk';

import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { usePathWithAddress } from '@hooks/paths';
import { useDatastore } from '@hooks/useDatastore';
import { createWrapper } from '@hooks/useSearchParams';

// FIXME: these look like UI-related types
import { DashboardAccountsHistoryLocation } from '../../../../../Routes';
import { chartColors } from '../../../../../Utilities';
import { AccountViewParams } from '../../../Dashboard';

// TODO(tjayrush): May be able to remove Omit
export const Charts = ({ params }: { params: Omit<AccountViewParams, 'theData'> }) => {
  const {
    userPrefs,
  } = params;
  const {
    hideZero,
  } = userPrefs;
  const {
    chain,
    denom,
    currentAddress,
    transactionsLoaded,
    transactionsFetchedByWorker,
  } = useGlobalState();

  const {
    getChartItems,
  } = useDatastore();

  const [items, setItems] = useState<GetChartItemsResult>([]);

  const getCurrentChartItems = useCallback(async () => {
    if (!currentAddress) return;

    if (!transactionsLoaded) return;

    const result = await getChartItems({
      chain: chain.chain,
      address: currentAddress,
      // TODO: typecast
      denom: denom as 'ether' | 'dollars',
      zeroBalanceStrategy: (() => {
        if (hideZero === 'all') return 'unset';
        if (hideZero === 'show') return 'ignore-non-zero';
        return 'ignore-zero';
      })(),
    });
    setItems(result);
  }, [chain, currentAddress, denom, getChartItems, hideZero, transactionsLoaded]);

  useEffect(() => { getCurrentChartItems(); }, [getCurrentChartItems]);

  useEffect(() => {
    if (transactionsFetchedByWorker > 0) {
      getCurrentChartItems();
    }
  }, [getCurrentChartItems, transactionsFetchedByWorker]);

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
export function getLink(chain: Chain, type: string, addr1: string, addr2?: string) {
  if (type === 'uni') {
    return `https://info.uniswap.org/#/tokens/${addr1}`;
  }

  let url;

  if (type === 'token') {
    url = new URL(
      `/address/${addr1}`,
      chain.remoteExplorer,
    );
  }

  if (type === 'holding' && chain.chain === 'mainnet') {
    url = new URL(
      `/token/${addr1}?a=${addr2}`,
      chain.remoteExplorer,
    );
  }

  return url?.toString() || '';
}

const ChartTitle = ({ index, asset }: { asset: GetChartItemsResult[0]; index: number }) => {
  const { currentAddress, chain } = useGlobalState();
  const {
    getNameFor,
  } = useDatastore();
  const { apiProvider } = useGlobalState2();
  const generatePathWithAddress = usePathWithAddress();
  const [assetName, setAssetName] = useState<Name>();

  useEffect(() => {
    (getNameFor({ address: asset.assetAddress }) as Promise<Name | undefined>)
      .then((nameDetails) => setAssetName(nameDetails));
  }, [asset.assetAddress, getNameFor]);

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
  if (!assetName) {
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

  const tokenSymbol = useMemo(() => (assetName
    ? assetName.name?.substr(0, 15) + (asset.assetSymbol
      ? ` (${asset.assetSymbol.substr(0, 15)})`
      : '')
    : asset.assetSymbol.substr(0, 15)),
  [asset.assetSymbol, assetName]);

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
