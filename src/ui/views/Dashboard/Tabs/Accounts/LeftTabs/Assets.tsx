// import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DashboardAccountsHistoryLocation } from '../../../../../Routes';
import { useGlobalNames } from '../../../../../State';
import { chartColors } from '../../../../../Utilities';
import { MyAreaChart } from '@components/MyAreaChart';
import { addColumn } from '@components/Table';
import { AssetHistory, Reconciliation, Transaction, TransactionArray } from '@modules/types';
import dayjs from 'dayjs';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Assets = ({
  theData,
  loading,
  accountAddress,
}: {
  theData: TransactionArray;
  loading: boolean;
  accountAddress: string;
}) => {
  const { names } = useGlobalNames();

  if (!theData) return <></>;

  let uniqAssets: any = [];
  theData.map((tx: Transaction) => {
    tx.statements?.map((statement: Reconciliation) => {
      if (uniqAssets.find((asset: AssetHistory) => asset.assetAddr === statement.assetAddr) === undefined) {
        uniqAssets.push({
          assetAddr: statement.assetAddr,
          assetSymbol: statement.assetSymbol,
          history: [],
        });
      }
    });

    uniqAssets.map((record: AssetHistory, i: number) => {
      const found = tx.statements?.find((s: any) => s.assetAddr === record.assetAddr);
      if (found) {
        uniqAssets[i].history = [
          ...uniqAssets[i].history,
          { balance: found.endBal, date: new Date(found.timestamp * 1000) },
        ];
      }
    });
  });

  // uniqAssets = uniqAssets.filter((record: AssetHistory) => {
  //   return record.history.length > 1 || (record.history.length === 1 && Number(record.history[0].balance) > 0);
  // });
  // uniqAssets = uniqAssets.filter((record: AssetHistory) => {
  //   return record.history.length > 2 || Number(record.history[record.history.length - 1].balance) > 0;
  // });
  // uniqAssets = uniqAssets.filter((record: AssetHistory) => {
  //   return record.history.length > 3;
  // });
  // uniqAssets = uniqAssets.filter((record: AssetHistory) => {
  //   return !names[record.assetAddr];
  // });

  uniqAssets.sort(function (a: any, b: any) {
    if (b.history.length === a.history.length) {
      if (b.history.length === 0) {
        return b.assetAddr - a.assetAddr;
      }
      return b.history[b.history.length - 1].balance - a.history[a.history.length - 1].balance;
    }
    return b.history.length - a.history.length;
  });

  const getTitle = (asset: AssetHistory, index: number) => {
    const links: any = [];
    links.push(<NavLink to={DashboardAccountsHistoryLocation}>History</NavLink>);
    if (!names[asset.assetAddr]) {
      links.push(
        <a target='_blank' href={'http://localhost:8080/names?autoname=' + asset.assetAddr}>
          AutoName
        </a>
      );
    }
    if (asset.assetSymbol === 'ETH') {
      links.push(
        <a target='_blank' href={'https://etherscan.io/address/' + asset.assetAddr}>
          Token
        </a>
      );
    } else {
      links.push(
        <a target='_blank' href={'https://etherscan.io/token/' + asset.assetAddr + '?a=' + accountAddress}>
          Holdings
        </a>
      );
      links.push(
        <a target='_blank' href={'https://etherscan.io/address/' + asset.assetAddr}>
          Token
        </a>
      );
    }

    return (
      <div key={index + 'd1'} style={{ overflowX: 'hidden' }}>
        {asset.assetSymbol === 'ETH'
          ? asset.assetSymbol
          : names[asset.assetAddr]
          ? names[asset.assetAddr].name?.substr(0, 15) +
            (asset.assetSymbol ? ' (' + asset.assetSymbol.substr(0, 15) + ')' : '')
          : asset.assetSymbol.substr(0, 15)}
        <br />
        <small>
          ({asset.history.length} txs){' '}
          <small>
            {links.map((link: any) => {
              return <div style={{ display: 'inline' }}>[{link}] </div>;
            })}
          </small>
        </small>
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
      {uniqAssets.map((asset: any, index: number) => {
        const color =
          asset.assetSymbol === 'ETH'
            ? '#63b598'
            : chartColors[Number('0x' + asset.assetAddr.substr(2, 6)) % chartColors.length];
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
        const title = getTitle(asset, index);
        const table = false;
        const items = asset.history.map((item: any) => {
          return {
            date: dayjs(item.date).format('YYYY-MM-DD'),
            [asset.assetAddr]: parseFloat(item.balance || 0),
          };
        });

        return (
          <MyAreaChart
            key={asset.assetAddr}
            items={items}
            columns={columns}
            index={asset.assetAddr}
            title={title}
            table={table}
            color={color}
          />
        );
      })}
    </div>
  );
};
