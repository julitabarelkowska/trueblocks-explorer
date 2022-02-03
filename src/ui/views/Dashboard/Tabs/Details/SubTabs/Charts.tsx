import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Reconciliation, Transaction } from '@sdk';
import dayjs from 'dayjs';

import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { createWrapper } from '@hooks/useSearchParams';
// FIXME: these look like UI-related types
import { AssetHistory, Balance } from '@modules/types';

import { DashboardAccountsHistoryLocation } from '../../../../../Routes';
import { useGlobalNames, useGlobalState, useGlobalState2 } from '../../../../../State';
import { chartColors } from '../../../../../Utilities';
import { AccountViewParams } from '../../../Dashboard';

export const Charts = ({ params }: { params: AccountViewParams }) => {
  const {
    theData,
    userPrefs,
  } = params;
  const {
    hideNamed,
    hideZero,
  } = userPrefs;
  const { denom } = useGlobalState();
  const { namesMap } = useGlobalNames();

  const uniqAssets = useMemo(() => {
    if (!theData.length) return [];

    const unique: Array<AssetHistory> = [];

    theData.forEach((tx: Transaction) => {
      tx.statements?.forEach((statement: Reconciliation) => {
        if (unique.find((asset: AssetHistory) => asset.assetAddr === statement.assetAddr) === undefined) {
          unique.push({
            assetAddr: statement.assetAddr,
            assetSymbol: statement.assetSymbol,
            balHistory: [],
          });
        }
      });

      unique.forEach((asset: AssetHistory, index: number) => {
        const found = tx.statements?.find((statement: Reconciliation) => asset.assetAddr === statement.assetAddr);
        // TODO: do not convert the below to strings
        if (found) {
          unique[index].balHistory = [
            ...unique[index].balHistory,
            {
              balance: (denom === 'dollars'
                ? parseInt(found.endBal.toString() || '0', 10) * Number(found.spotPrice)
                : parseInt(found.endBal.toString() || '0', 10)),
              date: new Date(found.timestamp * 1000),
              reconciled: found.reconciled,
            },
          ];
        }
      });
    });

    unique.sort((a: any, b: any) => {
      if (b.balHistory.length === a.balHistory.length) {
        if (b.balHistory.length === 0) {
          return b.assetAddr - a.assetAddr;
        }
        return b.balHistory[b.balHistory.length - 1].balance - a.balHistory[a.balHistory.length - 1].balance;
      }
      return b.balHistory.length - a.balHistory.length;
    });

    return unique.filter((asset: AssetHistory) => {
      if (asset.balHistory.length === 0) return false;
      const show = hideZero === 'all'
        || (hideZero === 'show' && asset.balHistory[asset.balHistory.length - 1].balance === 0)
        || (hideZero === 'hide' && asset.balHistory[asset.balHistory.length - 1].balance > 0);
      return show && (!hideNamed || !namesMap.get(asset.assetAddr));
    });
  }, [hideNamed, hideZero, namesMap, theData, denom]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
      {uniqAssets.map((asset: AssetHistory, index: number) => {
        const color = asset.assetSymbol === 'ETH'
          ? '#63b598'
          : chartColors[Number(`0x${asset.assetAddr.substr(4, 3)}`) % chartColors.length];
        const columns: any[] = [
          addColumn({
            title: 'Date',
            dataIndex: 'date',
          }),
          addColumn({
            title: asset.assetAddr,
            dataIndex: asset.assetAddr,
          }),
        ];

        const items = asset.balHistory.map((item: Balance) => ({
          date: dayjs(item.date).format('YYYY-MM-DD'),
          [asset.assetAddr]: item.balance,
        }));

        return (
          <MyAreaChart
            items={items}
            columns={columns}
            key={asset.assetAddr}
            index={asset.assetAddr}
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

const ChartTitle = ({ index, asset }: { asset: AssetHistory; index: number }) => {
  const { namesMap } = useGlobalNames();
  const { currentAddress, chain } = useGlobalState();
  const { coreUrl } = useGlobalState2();

  const links = [];
  links.push(
    <Link to={
      ({ search }) => `${DashboardAccountsHistoryLocation}?${createWrapper(search).set('asset', asset.assetAddr)}`
    }
    >
      History
    </Link>,
  );
  if (!namesMap.get(asset.assetAddr)) {
    links.push(
      <a target='_blank' href={`${coreUrl}/names?chain=${chain}&autoname=${asset.assetAddr}`} rel='noreferrer'>
        Name
      </a>,
    );
  }
  if (asset.assetSymbol !== 'ETH') {
    links.push(
      <a target='_blank' href={getLink(chain, 'holding', asset.assetAddr, currentAddress)} rel='noreferrer'>
        Holdings
      </a>,
    );
  }
  links.push(
    <a target='_blank' href={getLink(chain, 'token', asset.assetAddr, '')} rel='noreferrer'>
      Token
    </a>,
  );
  links.push(
    <a target='_blank' href={getLink(chain, 'uni', asset.assetAddr, '')} rel='noreferrer'>
      Uniswap
    </a>,
  );

  // TODO: Comment from @dszlachta
  // TODO: I think that it would be good to use useMemo here, so we don't have
  // TODO: to perform the lookup when the component re-renders:
  // TODO: const tokenSymbol = useMemo(() => /* lookupHere */, [deps]);
  // TODO: You could then cache namesMap.get(asset.assetAddrs) and
  // TODO: asset.assetSymbol.substr(0, 15) in variables
  const tokenSymbol = namesMap.get(asset.assetAddr)
    ? namesMap.get(asset.assetAddr)?.name?.substr(0, 15) + (asset.assetSymbol
      ? ` (${asset.assetSymbol.substr(0, 15)})`
      : '')
    : asset.assetSymbol.substr(0, 15);

  return (
    <div key={`${index}d1`} style={{ overflowX: 'hidden' }}>
      {asset.assetSymbol === 'ETH' ? asset.assetSymbol : tokenSymbol}
      <br />
      <small>
        (
        {asset.balHistory.length}
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
