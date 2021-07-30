import {
  DashboardAccountsChartsLocation,
  DashboardAccountsEventsLocation,
  DashboardAccountsFunctionsLocation,
  DashboardAccountsGasLocation,
  DashboardAccountsHistoryLocation,
  DashboardAccountsLocation,
  DashboardAccountsNeighborsLocation,
} from '../../../../Routes';
import useGlobalState, { useGlobalNames } from '../../../../State';
import { AccountViewParams } from '../../Dashboard';
import { Assets } from './LeftTabs/Assets';
import { Events } from './LeftTabs/Events';
import { Functions } from './LeftTabs/Functions';
import { Gas } from './LeftTabs/Gas';
import { History } from './LeftTabs/History';
import { Neighbors } from './LeftTabs/Neighbors';
import { CheckCircleFilled, CloseCircleFilled, DownOutlined } from '@ant-design/icons';
import { BaseView, ViewTab } from '@components/BaseView';
import { addColumn } from '@components/Table';
import { AssetHistoryArray, Reconciliation, ReconciliationArray, Transaction } from '@modules/types';
import { Checkbox, Divider, Dropdown, Input, Menu, message, Progress } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { createUseStyles } from 'react-jss';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

export const AccountsView = ({ params }: { params: AccountViewParams }) => {
  const { theData, uniqAssets, loading } = params;

  if (!theData || !uniqAssets) return <></>;

  const leftSideTabs: ViewTab[] = [
    {
      name: 'Assets',
      location: DashboardAccountsChartsLocation,
      component: <Assets params={params} />,
    },
    {
      name: 'History',
      location: DashboardAccountsHistoryLocation,
      component: <History theData={theData} loading={loading} />,
    },
    {
      name: 'Events',
      location: DashboardAccountsEventsLocation,
      component: <Events theData={theData} loading={loading} />,
    },
    {
      name: 'Functions',
      location: DashboardAccountsFunctionsLocation,
      component: <Functions theData={theData} loading={loading} />,
    },
    {
      name: 'Gas',
      location: DashboardAccountsGasLocation,
      component: <Gas theData={theData} loading={loading} />,
    },
    {
      name: 'Neighbors',
      location: DashboardAccountsNeighborsLocation,
      component: <Neighbors theData={theData} loading={loading} />,
    },
  ];

  return (
    <div>
      <AddressBar params={params} />
      <Divider style={{ height: '1px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '20fr 1fr' }}>
        <BaseView
          defaultActive={DashboardAccountsChartsLocation}
          baseActive={DashboardAccountsLocation}
          cookieName={'COOKIE_DASHBOARD_ACCOUNT_SUB_TAB'}
          tabs={leftSideTabs}
          position='left'
          subBase={true}
        />
        <ViewOptions params={params} />
      </div>
    </div>
  );
};

const ViewOptions = ({ params }: { params: AccountViewParams }) => {
  const { setStaging, denom, setDenom, setTransactions, staging, uniqAssets } = params;

  const onStaging = () => setStaging(!staging);

  const onEther = () => {
    denom === 'ether' ? setDenom('') : setDenom('ether');
    setTransactions({ status: 'success' }); // empty
  };

  const onDollars = useCallback(() => {
    denom === 'dollars' ? setDenom('') : setDenom('dollars');
    setTransactions({ status: 'success' }); // empty
  }, []);

  return (
    <div>
      <AssetSelector uniqAssets={uniqAssets} />
      <p />
      <b>
        <u>options: </u>
      </b>
      <Checkbox checked={staging} onChange={() => onStaging()}>
        staging
      </Checkbox>
      <br />
      <Checkbox checked={denom === 'ether'} onChange={() => onEther()}>
        ether
      </Checkbox>
      <br />
      <Checkbox checked={denom === 'dollars'} onChange={() => onDollars()}>
        dollars
      </Checkbox>
    </div>
  );
};

const AssetSelector = ({ uniqAssets }: { uniqAssets: AssetHistoryArray }) => {
  const styles = useStyles();

  const onClick = ({ key }: { key: any }) => {
    message.info(`Click on item ${uniqAssets[key].assetAddr}`);
  };

  const menu = (
    <Menu onClick={onClick}>
      {uniqAssets.map((item, index) => {
        return <Menu.Item key={index}>{item.assetSymbol}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <>
      <div className={styles.smallHeader}>asset: </div>
      <Dropdown overlay={menu} trigger={['click']}>
        <a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
          Filter <DownOutlined />
        </a>
      </Dropdown>
    </>
  );
};
/*
 import { Select } from 'antd';

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

class SelectWithHiddenSelectedOptions extends React.Component {
  state = {
    selectedItems: [],
  };

  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };

  render() {
    const { selectedItems } = this.state;
    const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o));
    return (
      <Select
        mode="multiple"
        placeholder="Inserted are removed"
        value={selectedItems}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {filteredOptions.map(item => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

ReactDOM.render(<SelectWithHiddenSelectedOptions />, mountNode);
*/

const AddressInput = ({ params }: { params: AccountViewParams }) => {
  const { loading, setTransactions } = params;
  const { accountAddress, setAccountAddress } = useGlobalState();
  return (
    <Input
      disabled={loading}
      placeholder={'Input an address'}
      value={accountAddress}
      onChange={(e) => {
        setTransactions({ status: 'success' }); // empty
        setAccountAddress(e.target.value);
      }}
    />
  );
};

const ProgressBar = ({ params }: { params: AccountViewParams }): JSX.Element => {
  const { theData, totalRecords } = params;
  if (!theData) return <></>;
  if (!totalRecords) return <></>;
  if (theData.length === totalRecords) return <></>;
  const pct = Math.floor((theData.length / (totalRecords || 1)) * 100);
  return (
    <Progress style={{ width: '200px', position: 'absolute', right: '8px' }} percent={pct} strokeLinecap='square' />
  );
};

const AddressBar = ({ params }: { params: AccountViewParams }) => {
  const input = <AddressInput params={params} />;
  const progress = <ProgressBar params={params} />;
  return (
    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <h3 style={{ marginRight: '12px', flexShrink: 0 }}>Accounting for </h3>
      {input}
      {progress}
    </div>
  );
};

export const renderAsNamedAddress = (address: string, acctFor: string) => {
  const { names } = useGlobalNames();

  const isCurrent = address === acctFor;
  const isSpecial = address === '0xPrefund' || address === '0xBlockReward' || address === '0xUncleReward';

  let name = names && names[address] && names[address].name;
  if (!isSpecial && !isCurrent && !name) {
    return <div style={{ color: 'grey' }}>{address}</div>;
  }

  let style = isCurrent ? { color: 'blue' } : { color: 'green' };
  if (isSpecial) {
    name = '';
    style = { color: 'green' };
  }

  const addr =
    name === '' || name === undefined
      ? address
      : '[' + address?.substr(0, 6) + '...' + address?.substr(address.length - 4, address.length) + '] ';
  return (
    <div style={style}>
      {addr}
      {name}
    </div>
  );
};

export const transactionSchema: ColumnsType<Transaction> = [
  addColumn({
    title: 'Date',
    dataIndex: 'date',
    configuration: {
      width: '15%',
      render: (field: any, record: Transaction) => {
        if (!record) return <div></div>;
        return (
          <pre>
            <div>{dayjs(record.date).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div>{dayjs.unix(record.timestamp).fromNow()}</div>
            <div style={{ fontSize: 'small', fontStyle: 'italic' }}>
              {record.blockNumber?.toString() + '.' + record.transactionIndex?.toString()}
            </div>
          </pre>
        );
      },
    },
  }),
  addColumn({
    title: 'From / To',
    dataIndex: 'from',
    configuration: {
      width: '30%',
      render: (unused: any, record: Transaction) => {
        if (!record) return <div></div>;
        const to = record.to === record.extraData ? <div style={style}>{record.to}</div> : record.to;
        return (
          <pre>
            {renderAsNamedAddress(record.from, record.extraData)}
            {renderAsNamedAddress(record.to, record.extraData)}
          </pre>
        );
      },
    },
  }),
  addColumn({
    title: 'Reconciliations (asset, beg, in, out, gasOut, end, check)',
    dataIndex: 'compressedTx',
    configuration: {
      width: '50%',
      render: (item, record) => {
        item = record.compressedTx;
        if (item === '' && record.from === '0xPrefund') item = '0xPrefund';
        if (item === '' && record.from === '0xBlockReward') item = '0xBlockReward';
        if (item === '' && record.from === '0xUncleReward') item = '0xUncleReward';
        return (
          <div style={{ border: '1px solid darkgrey' }}>
            <div
              style={{
                padding: '2px',
                paddingLeft: '5px',
                backgroundColor: 'lightgrey',
                color: '#222222',
                overflowX: 'hidden',
              }}>
              {item}
            </div>
            <div>{renderStatements(record.statements)}</div>
          </div>
        );
      },
    },
  }),
  addColumn({
    title: '',
    dataIndex: 'statements',
    configuration: {
      width: '5%',
      render: (item, record, index) => (
        <a target='_blank' href={'http://etherscan.io/tx/' + record.hash}>
          ES
        </a>
      ),
    },
  }),
];

export const renderStatements = (statements: ReconciliationArray) => {
  const styles = useStyles();
  if (statements === null) return <></>;
  return (
    <table className={style.table}>
      <tbody>
        {statements?.map((statement, i) => {
          return (
            <Statement
              key={
                statement.blockNumber * 100000 + statement.transactionIndex + statement.assetSymbol ||
                `${i}-${Math.random()}`
              }
              statement={statement}
            />
          );
        })}
      </tbody>
    </table>
  );
};

const ReconIcon = ({ reconciled }: { reconciled: boolean }) => {
  return (
    <div>
      {reconciled ? <CheckCircleFilled style={{ color: 'green' }} /> : <CloseCircleFilled style={{ color: 'red' }} />}
    </div>
  );
};

const Statement = ({ statement }: { statement: Reconciliation }) => {
  const styles = useStyles();

  return (
    <tr className={styles.row} key={statement.assetSymbol || Math.random()}>
      <td key={`${1}-${Math.random()}`} className={styles.col} style={{ width: '12%' }}>
        {statement.assetSymbol?.slice(0, 5)}
      </td>
      <td key={`${2}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.begBal)}
      </td>
      <td key={`${3}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.totalIn)}
      </td>
      <td key={`${4}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.totalOut)}
      </td>
      <td key={`${5}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.gasCostOut, true)}
      </td>
      <td key={`${6}-${Math.random()}`} className={styles.col} style={{ width: '17%' }}>
        {clip(statement.endBal)}
      </td>
      <td key={`${7}-${Math.random()}`} className={styles.col} style={{ width: '4%' }}>
        <ReconIcon reconciled={statement.reconciled} />
      </td>
    </tr>
  );
};

const clip = (num: string, is_gas?: boolean) => {
  const parts = num.split('.');
  if (parts.length === 0 || parts[0] === '')
    return (
      <div style={{ color: 'lightgrey' }}>
        {'0.000000'}
        {is_gas ? 'g' : ''}
      </div>
    );
  if (parts.length === 1)
    return (
      parts[0] +
      (
        <div>
          {'.000000'}
          {is_gas ? 'g' : ''}
        </div>
      )
    );
  return (
    <div>
      {parts[0] + '.' + parts[1].substr(0, 6)}
      {is_gas ? 'g' : ''}
    </div>
  );
};

const useStyles = createUseStyles({
  table: {},
  row: {},
  col: {
    textAlign: 'right',
    backgroundColor: '#fff7e6',
  },
  smallHeader: {
    fontWeight: 800,
    textDecoration: 'underlined',
  },
});
