import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

// TODO: this should be in messages.ts
type ChartData = { assetAddr: string, assetSymbol: string, items: { [key: string]: string | number }[] }[];

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

  const [items, setItems] = useState<ChartData>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
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

  useEffect(() => onMessage<ChartData>((message) => {
    // if (message.call === 'loadTransactions') {

    //   return;
    // }

    if (message.call !== 'getChartItems') return;

    console.log('Got', message);
    setItems(message.result);
  }), [onMessage]);

  // const uniqAssets = useMemo(() => {
  //   if (!theData.length) return [];

  //   const unique: Array<AssetHistory> = [];

  //   theData.forEach((tx: Transaction) => {
  //     tx.statements?.forEach((statement: Reconciliation) => {
  //       if (unique.find((asset: AssetHistory) => asset.assetAddr === statement.assetAddr) === undefined) {
  //         unique.push({
  //           assetAddr: statement.assetAddr,
  //           assetSymbol: statement.assetSymbol,
  //           balHistory: [],
  //         });
  //       }
  //     });

  //     unique.forEach((asset: AssetHistory, index: number) => {
  //       const found = tx.statements?.find((statement: Reconciliation) => asset.assetAddr === statement.assetAddr);
  //       // TODO: do not convert the below to strings
  //       if (found) {
  //         unique[index].balHistory = [
  //           ...unique[index].balHistory,
  //           {
  //             balance: (denom === 'dollars'
  //               ? parseInt(found.endBal.toString() || '0', 10) * Number(found.spotPrice)
  //               : parseInt(found.endBal.toString() || '0', 10)),
  //             date: new Date(found.timestamp * 1000),
  //             reconciled: found.reconciled,
  //           },
  //         ];
  //       }
  //     });
  //   });

  //   unique.sort((a: any, b: any) => {
  //     if (b.balHistory.length === a.balHistory.length) {
  //       if (b.balHistory.length === 0) {
  //         return b.assetAddr - a.assetAddr;
  //       }
  //       return b.balHistory[b.balHistory.length - 1].balance - a.balHistory[a.balHistory.length - 1].balance;
  //     }
  //     return b.balHistory.length - a.balHistory.length;
  //   });

  //   return unique.filter((asset: AssetHistory) => {
  //     if (asset.balHistory.length === 0) return false;
  //     const show = hideZero === 'all'
  //       || (hideZero === 'show' && asset.balHistory[asset.balHistory.length - 1].balance === 0)
  //       || (hideZero === 'hide' && asset.balHistory[asset.balHistory.length - 1].balance > 0);
  //     return show && (!hideNamed || !namesMap.get(asset.assetAddr));
  //   });
  // }, [hideNamed, hideZero, namesMap, theData, denom]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
      {items.map((asset, index: number) => {
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

        // const items = asset.balHistory.map((item: Balance) => ({
        //   date: dayjs(item.date).format('YYYY-MM-DD'),
        //   [asset.assetAddr]: item.balance,
        // }));

        return (
          <MyAreaChart
            items={asset.items}
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

const ChartTitle = ({ index, asset }: { asset: ChartData[0]; index: number }) => {
  const { namesMap } = useGlobalNames();
  const { currentAddress, chain } = useGlobalState();
  const { apiProvider } = useGlobalState2();
  const generatePathWithAddress = usePathWithAddress();

  const links = [];
  links.push(
    <Link to={
      ({ search }) => {
        const path = generatePathWithAddress(DashboardAccountsHistoryLocation);
        return `${path}?${createWrapper(search).set('asset', asset.assetAddr)}`;
      }
    }
    >
      History
    </Link>,
  );
  if (!namesMap.get(asset.assetAddr)) {
    links.push(
      <a target='_blank' href={`${apiProvider}/names?chain=${chain}&autoname=${asset.assetAddr}`} rel='noreferrer'>
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
