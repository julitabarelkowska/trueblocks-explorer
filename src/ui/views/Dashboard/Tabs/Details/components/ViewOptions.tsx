import React, { useMemo, useState } from 'react';

import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Badge,
  Button, Checkbox, Dropdown, Form, Menu, Select, Space,
} from 'antd';

import { useGlobalState } from '../../../../../State';
import { AccountViewParams } from '../../../Dashboard';
import {
  exportToCsv, exportToJson, exportToOfx, exportToTxt,
} from './Export';

import './ViewOptions.css';

export const ViewOptions = ({ params }: { params: AccountViewParams }) => {
  const { denom, setDenom } = useGlobalState();
  const [optionsVisible, setOptionsVisible] = useState(false);

  const { userPrefs } = params;

  const repOptions = useMemo(() => ['by tx', 'by hour', 'by day', 'by week', 'by month', 'by quarter', 'by year'], []);

  const someOptionsActive = useMemo(() => [
    userPrefs.hideZero !== 'all',
    userPrefs.period !== repOptions[0],
    userPrefs.hideNamed,
    userPrefs.hideReconciled,
    userPrefs.showDetails,
    userPrefs.showReversed,
    userPrefs.showStaging,
    userPrefs.showUnripe,
    denom !== 'ether',
  ].some(Boolean), [
    denom,
    repOptions,
    userPrefs.hideNamed,
    userPrefs.hideReconciled,
    userPrefs.hideZero,
    userPrefs.period,
    userPrefs.showUnripe,
    userPrefs.showDetails,
    userPrefs.showReversed,
    userPrefs.showStaging,
  ]);

  const onEther = () => {
    setDenom('ether');
  };

  const onDollars = () => {
    setDenom('dollars');
  };

  const onHideZero = () => {
    userPrefs.setHideZero(userPrefs.hideZero === 'hide' ? 'all' : 'hide');
  };
  const onShowZero = () => {
    userPrefs.setHideZero(userPrefs.hideZero === 'show' ? 'all' : 'show');
  };
  const onShowAll = () => {
    userPrefs.setHideZero(userPrefs.hideZero === 'all' ? 'hide' : 'all');
  };

  const onExportCSV = () => {
    exportToCsv(params.theData);
  };
  const onExportTXT = () => {
    exportToTxt(params.theData);
  };
  const onExportOFX = () => {
    exportToOfx(params.theData);
  };
  const onExportJson = () => {
    exportToJson(params.theData);
  };

  const exportOverlay = (
    <Menu>
      <Menu.Item key='csv' onClick={onExportCSV}>
        CSV...
      </Menu.Item>
      <Menu.Item key='txt' onClick={onExportTXT}>
        TXT...
      </Menu.Item>
      <Menu.Item key='json' onClick={onExportJson}>
        JSON...
      </Menu.Item>
      <Menu.Item key='qb' onClick={onExportOFX}>
        QB...
      </Menu.Item>
    </Menu>
  );

  return (
    <div className='viewOptions'>
      <Space>
        <Button onClick={() => setOptionsVisible((value) => !value)}>
          <SettingOutlined />
          {optionsVisible ? 'Hide' : 'Show'}
          {' '}
          View Options
          {someOptionsActive ? <Badge dot /> : null}
        </Button>
        <Dropdown overlay={exportOverlay} trigger={['click']}>
          <Button>
            Export
            {' '}
            <DownOutlined />
          </Button>
        </Dropdown>
      </Space>

      { optionsVisible
        ? (
          <div>
            <Form colon={false}>
              <Form.Item
                label='Order'
              >
                <Checkbox checked={userPrefs.showReversed} onChange={() => userPrefs.setShowReversed(!userPrefs.showReversed)}>
                  reversed
                </Checkbox>
              </Form.Item>
              <Form.Item
                label='Head'
              >
                <div>
                  <Checkbox checked={userPrefs.showStaging} onChange={() => userPrefs.setShowStaging(!userPrefs.showStaging)}>
                    staging
                  </Checkbox>
                </div>
                <div>
                  {/* TODO(tjayrush): should be unripe... */}
                  <Checkbox checked={userPrefs.showUnripe} onChange={() => userPrefs.setShowUnripe(!userPrefs.showUnripe)}>
                    unripe
                  </Checkbox>
                </div>
              </Form.Item>
              <Form.Item
                label='Display'
              >
                <Select
                  placeholder='display by'
                  value={userPrefs.period}
                  onChange={(newValue) => userPrefs.setPeriod(newValue)}
                  style={{ width: '100%' }}
                >
                  {repOptions.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
                <div>
                  <div>
                    <Checkbox checked={userPrefs.hideNamed} onChange={() => userPrefs.setHideNamed(!userPrefs.hideNamed)}>
                      unnamed
                    </Checkbox>
                  </div>
                  <div>
                    <Checkbox
                      checked={
                        userPrefs.hideReconciled
                      }
                      onChange={() => userPrefs.setHideReconciled(!userPrefs.hideReconciled)}
                    >
                      unreconciled
                    </Checkbox>
                  </div>
                  <div>
                    <Checkbox checked={userPrefs.showDetails} onChange={() => userPrefs.setShowDetails(!userPrefs.showDetails)}>
                      details
                    </Checkbox>
                  </div>
                </div>
              </Form.Item>
              <Form.Item
                label='Zero balance'
              >
                <div>
                  <Checkbox checked={userPrefs.hideZero === 'hide'} onChange={() => onHideZero()}>
                    hide
                  </Checkbox>
                </div>
                <div>
                  <Checkbox checked={userPrefs.hideZero === 'show'} onChange={() => onShowZero()}>
                    show
                  </Checkbox>
                </div>
                <div>
                  <Checkbox checked={userPrefs.hideZero === 'all'} onChange={() => onShowAll()}>
                    show all
                  </Checkbox>
                </div>
              </Form.Item>
              <Form.Item
                label='Denomination'
              >
                <div>
                  <Checkbox checked={denom === 'ether'} onChange={() => onEther()}>
                    ether
                  </Checkbox>
                </div>
                <div>
                  <Checkbox checked={denom === 'dollars'} onChange={() => onDollars()}>
                    dollars
                  </Checkbox>
                </div>
              </Form.Item>
            </Form>
          </div>
        )
        : null}
    </div>
  );
};
