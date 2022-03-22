import React from 'react';

import { BaseView } from '@components/BaseView';

import {
  SettingsCachesLocation,
  SettingsDataModelLocation,
  SettingsIndexesChartsLocation,
  SettingsIndexesGridLocation,
  SettingsIndexesLocation,
  SettingsIndexesManifestLocation,
  SettingsIndexesTableLocation,
  SettingsLocation,
  SettingsScrapersLocation,
  SettingsSkinsLocation,
} from '../../Routes';
import { Caches } from './Tabs/Caches';
import { DataModel } from './Tabs/Data Model';
import { IndexesView } from './Tabs/Indexes';
import { Scrapers } from './Tabs/Scrapers';
import { Skins } from './Tabs/Skins';

export const SettingsView = () => {
  const tabs = [
    { name: 'Scrapers', location: [SettingsLocation, SettingsScrapersLocation], component: <Scrapers /> },
    {
      name: 'Indexes',
      location: [
        SettingsIndexesLocation,
        SettingsIndexesGridLocation,
        SettingsIndexesTableLocation,
        SettingsIndexesChartsLocation,
        SettingsIndexesManifestLocation,
      ],
      component: <IndexesView />,
    },
    { name: 'Caches', location: SettingsCachesLocation, component: <Caches /> },
    { name: 'Skins', location: SettingsSkinsLocation, component: <Skins /> },
    { name: 'Data Model', location: SettingsDataModelLocation, component: <DataModel /> },
  ];
  return <BaseView title='Settings' cookieName='COOKIE_SETTINGS' tabs={tabs} />;
};
