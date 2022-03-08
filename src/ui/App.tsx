import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Redirect, useHistory } from 'react-router-dom';

import {
  BookOutlined,
  CameraOutlined,
  PhoneOutlined,
  QuestionCircleFilled,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  getStatus, Status, SuccessResponse,
} from '@sdk';
import {
  Layout,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { ChainSelect } from '@components/ChainSelect';
import { Console } from '@components/Console';
import { MainMenu, MenuItems } from '@components/MainMenu';
import { HelpPanel } from '@components/SidePanels/HelpPanel';
import { PanelDirection, SidePanel } from '@components/SidePanels/SidePanel';
import { StatusPanel } from '@components/SidePanels/StatusPanel';
import { useDatastore } from '@hooks/useDatastore';
import {
  isFailedCall, isSuccessfulCall, wrapResponse,
} from '@modules/api/call_status';
import { createEmptyMeta } from '@modules/types/Meta';
import { createEmptyStatus } from '@modules/types/Status';

import {
  ExplorerLocation, NamesLocation, RootLocation, Routes, SettingsLocation, SupportLocation,
} from './Routes';
import { useGlobalState } from './State';

import 'antd/dist/antd.css';
import './app.css';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const useStyles = createUseStyles({
  help_icon: { color: 'green' },
});

export const App = () => {
  const { chain } = useGlobalState();
  dayjs.extend(relativeTime);

  const { location, action } = useHistory();
  const [status, setStatus] = useState<Pick<SuccessResponse<Status>, 'data' | 'meta'>>({
    data: createEmptyStatus(),
    meta: createEmptyMeta(),
  });
  const [statusError, setStatusError] = useState(false);
  const [loadingStatus] = useState(false);
  const [lastLocation, setLastLocation] = useState('');
  const styles = useStyles();
  const {
    loadNames,
  } = useDatastore();

  useEffect(() => loadNames({
    chain,
    terms: [''],
    expand: true,
    all: true,
  }), [chain, loadNames]);

  useEffect(() => setLastLocation(localStorage.getItem('lastLocation') || ''), []);
  useEffect(() => {
    // if action is POP, it means that the site was just loaded. Otherwise router
    // navigation occured.
    if (action === 'POP') return;
    localStorage.setItem('lastLocation', location.pathname);
  }, [action, location.pathname]);

  useEffect(() => {
    const fetchStatus = async () => {
      const statusResponse = wrapResponse(await getStatus({
        chain,
      }));

      if (isSuccessfulCall(statusResponse)) {
        setStatus({
          data: statusResponse.data[0] as Status,
          meta: statusResponse.meta,
        });
      }

      if (isFailedCall(statusResponse)) {
        setStatusError(true);
      }
    };

    fetchStatus();

    const intervalId = setInterval(fetchStatus, 10 * 1000);

    return () => clearInterval(intervalId);
  }, [chain]);

  // const namesRequest = useSdk(() => getNames({
  //   chain,
  //   terms: [''],
  //   expand: true,
  //   all: true,
  // }));

  // useEffect(() => {
  //   const resultMap = (() => {
  //     if (!isSuccessfulCall(namesRequest)) return new Map();

  //     const { data: fetchedNames } = namesRequest;

  //     if (typeof fetchedNames === 'string') return new Map();

  //     return new Map((fetchedNames as Name[]).map((name) => [name.address, name]));
  //   })();

  //   setNamesMap(resultMap);
  // }, [namesRequest, setNamesMap]);

  const menuItems: MenuItems = [
    {
      text: 'Dashboard',
      icon: <UnorderedListOutlined />,
      to: RootLocation,
    },
    {
      text: 'Names',
      icon: <BookOutlined />,
      to: NamesLocation,
    },
    {
      text: 'Explorer',
      icon: <CameraOutlined />,
      to: ExplorerLocation,
    },
    {
      text: 'Settings',
      icon: <SettingOutlined />,
      to: SettingsLocation,
    },
    {
      text: 'Support',
      icon: <PhoneOutlined />,
      to: SupportLocation,
    },
  ];

  // If the app was just loaded, the route is / and the last visited location is something else,
  // then we want to redirect the user to the place they viewed last time.
  if (action === 'POP' && lastLocation && lastLocation !== '/' && location.pathname === '/') {
    return <Redirect to={lastLocation} />;
  }

  // TODO: BOGUS - {`TrueBlocks Account Explorer - ${process.env.CHAIN} chain`}
  return (
    <Layout>
      <Header className='app-header'>
        <Title style={{ color: 'white' }} level={2}>
          {`TrueBlocks Account Explorer - ${chain} chain`}
        </Title>
        <ChainSelect />
      </Header>
      <Layout>
        <SidePanel header='Menu' dir={PanelDirection.Left} cookieName='MENU_EXPANDED' collapsibleContent={false}>
          <MainMenu items={menuItems} />
        </SidePanel>
        <Layout>
          <Layout>
            <Content
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                overflowY: 'scroll',
              }}
            >
              <Routes />
            </Content>
            <SidePanel header='Status' cookieName='STATUS_EXPANDED' dir={PanelDirection.Right}>
              <StatusPanel chain={chain} status={status} loading={loadingStatus} error={statusError} />
            </SidePanel>
            <SidePanel
              header='Help'
              cookieName='HELP_EXPANDED'
              dir={PanelDirection.Right}
              customCollapseIcon={<QuestionCircleFilled className={styles.help_icon} />}
              customExpandIcon={<QuestionCircleFilled className={styles.help_icon} />}
            >
              <HelpPanel />
            </SidePanel>
          </Layout>
          <Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div />
            <Console />
            <div />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
