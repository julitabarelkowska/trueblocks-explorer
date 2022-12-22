import React from 'react';
import { createUseStyles } from 'react-jss';

import {
  ApiFilled, EyeFilled,
} from '@ant-design/icons';
import { Badge } from 'antd';
import filesize from 'filesize';
import { Chain, Config, SuccessResponse } from 'trueblocks-sdk';

import { Loading } from '@components/Loading';
import { createEmptyMeta } from '@modules/types/Meta';

import { useGlobalState2 } from '../../State';

interface StatusPanelProps {
  // status is always a { data: ..., meta: ... } because of the way we fetch it in App.ts
  chain: string;
  status: Pick<SuccessResponse<Config>, 'data' | 'meta'>;
  error: boolean;
  loading: boolean;
}

export const StatusPanel = ({
  chain, status, loading, error,
}: StatusPanelProps) => {
  const { apiProvider } = useGlobalState2();
  const styles = useStyles();

  const statusData = status.data;
  const m = error ? createEmptyMeta() : status.meta;

  const node = (
    <div>
      <Badge status={error ? 'error' : 'success'} />
      {error ? 'Error' : 'Connected'}
    </div>
  );
  const server = (
    <>
      <Badge status={statusData.isApi ? 'success' : 'error'} />
      {statusData.isApi ? 'Connected' : 'Not connected'}
    </>
  );
  const scraper = (
    <>
      <Badge status={statusData.isScraping ? 'success' : 'error'} />
      {statusData.isScraping ? 'Scraping' : 'Not scraping'}
    </>
  );
  const monitors = (
    <>
      <EyeFilled className={styles.itemIcon} />
      {`${statusData.caches[1].nFiles} (${filesize(statusData.caches[1].sizeInBytes)})`}
    </>
  );
  const chains = (
    <>
      {statusData.chains.map((ch: Chain) => {
        const style = chain === ch.chain ? styles.selected : '';
        return (
          <div key={ch.chain} className={style} style={{ display: 'inline' }}>{` ${ch.chain}`}</div>
        );
      })}
    </>
  );

  return (
    <Loading loading={loading}>
      <div style={{ marginLeft: '4px' }}>
        <Header text='Status' />
        <Item title='Ethereum' value={node} />
        <Item title='Server' value={server} />
        <Item title='Scraper' value={scraper} />
        <Separator />

        <Header text='Progress' />
        <Progress client={m.client} color='white' word='Latest' value={m.client} show />
        <Progress client={m.client} color='#52c41a' word='Final' value={m.finalized} show />
        <Progress client={m.client} color='#fadb14' word='Staging' value={m.staging} show />
        <Progress client={m.client} color='#fadb14' word='Ripe' value={m.ripe} show={m.ripe !== m.staging} />
        <Progress client={m.client} color='#f5222d' word='Unripe' value={m.unripe} show={m.unripe !== m.ripe} />
        <Separator />

        <Header text='Monitors' />
        <Item title='' value={monitors} />
        <Separator />

        <Header text='Options' />
        <Item title='RPC' value={statusData.rpcProvider} />
        <Item title='API' value={apiProvider} />
        <Item title='Cache' value={statusData.cachePath} />
        <Item title='Index' value={statusData.indexPath} />
        <Separator />

        <Header text='Versions' />
        <Item title='Client' value={statusData.clientVersion} />
        <Item title='TrueBlocks' value={statusData.trueblocksVersion} />
        <Separator />

        <Header text={`Chains: ${statusData.chains.length}`} />
        <Item title='' value={chains} />
        <Separator />
      </div>
    </Loading>
  );
};

const Item = ({ title, value }: {title: string, value: any}) => {
  const styles = useStyles();
  return (
    <>
      {title ? <div className={styles.itemHeader}>{title}</div> : <></>}
      <div style={{ marginLeft: '8px' }}>{value}</div>
    </>
  );
};

const Separator = () => {
  const styles = useStyles();
  return <div className={styles.separator} />;
};

const Header = ({ text }:{text: string}) => {
  const styles = useStyles();
  return <div className={styles.header}>{text}</div>;
};

const Progress = ({
  value,
  client,
  word,
  color,
  show,
}: {
  value: number;
  client: number;
  word: string;
  color: string;
  show: boolean;
}) => {
  const styles = useStyles();
  if (!show) return <></>;
  const cn: string = styles.itemIcon;
  const dist = Intl.NumberFormat().format(Math.abs(client - value));
  const msg = dist !== '0' ? (
    <>
      {' '}
      <ApiFilled className={styles.itemIcon} style={{ color: 'white' }} />
      {dist}
      <span className={styles.statusItem}>
        behind
        <br />
      </span>
    </>
  ) : <></>;

  return (
    <div style={{ marginLeft: '10px' }}>
      <ApiFilled className={cn} style={{ color: `${color}` }} />
      {Intl.NumberFormat().format(value)}
      <span className={styles.statusItem}>
        {word}
        <br />
      </span>
      {msg}
    </div>
  );
};

const useStyles = createUseStyles({
  header: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '2px',
    textTransform: 'uppercase',
  },
  itemHeader: {
    fontSize: '12px',
    fontWeight: 500,
    marginTop: '2px',
    textTransform: 'uppercase',
  },
  itemIcon: { fontSize: '10px', marginRight: '4px' },
  statusItem: {
    fontSize: '9px',
    fontWeight: 500,
    marginLeft: '10px',
    textTransform: 'uppercase',
  },
  selected: {
    border: 'dashed', padding: '1px', fontWeight: 'bold',
  },
  separator: { marginBottom: '24px' },
});
