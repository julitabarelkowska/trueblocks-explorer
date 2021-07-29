import {
  SettingsCachesLocation,
  SettingsIndexesLocation,
  SettingsLocation,
  SettingsSchemasLocation,
  SettingsScrapersLocation,
  SettingsSkinsLocation,
} from '../../Routes';
import { Caches } from './Tabs/Caches';
import { IndexesView } from './Tabs/Indexes/Indexes';
import { Schemas } from './Tabs/Schemas';
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
    { name: 'Schemas', location: SettingsSchemasLocation, component: <Schemas /> },
  ];

  return (
    <BaseView
      title={title}
      defaultActive={SettingsScrapersLocation}
      baseActive={SettingsLocation}
      cookieName={'COOKIE_SETTINGS_CURRENT_TAB'}
      tabs={tabs}
    />
  );
};
