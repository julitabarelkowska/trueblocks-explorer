import {
  SettingsCachesLocation,
  SettingsDataModelLocation,
  SettingsIndexesLocation,
  SettingsScrapersLocation,
  SettingsSkinsLocation,
} from '../../Routes';
import { Caches } from './Tabs/Caches';
import { DataModel } from './Tabs/DataModel';
import { IndexesView } from './Tabs/Indexes/Indexes';
import { Scrapers } from './Tabs/Scrapers';
import { Skins } from './Tabs/Skins';
import { BaseView } from '@components/BaseView';
import React from 'react';

export const SettingsView = () => {
  const title = 'Settings';
  const tabs = [
    { name: 'Scrapers', location: SettingsScrapersLocation, component: <Scrapers /> },
    { name: 'Indexes', location: SettingsIndexesLocation, component: <IndexesView />, disabled: false },
    { name: 'Caches', location: SettingsCachesLocation, component: <Caches /> },
    { name: 'Skins', location: SettingsSkinsLocation, component: <Skins /> },
    { name: 'Data Model', location: SettingsDataModelLocation, component: <DataModel /> },
  ];

  return <BaseView title={title} cookieName={'COOKIE_SETTINGS'} tabs={tabs} />;
};
