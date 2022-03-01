import React from 'react';

import { BaseView } from '@components/BaseView';

import {
  NamesAddressesLocation, NamesBlocksLocation, NamesLocation, NamesSignaturesEventsLocation, NamesSignaturesFunctionsLocation, NamesSignaturesLocation, NamesTagsLocation,
} from '../../Routes';
import { Names } from './Tabs/Names';
import { Signatures } from './Tabs/Signatures';
import { Tags } from './Tabs/Tags';
import { When } from './Tabs/When';

export const NamesView = () => {
  const tabs = [
    { name: 'Named Addresses', location: [NamesLocation, NamesAddressesLocation], component: <Names /> },
    { name: 'Address Tags', location: NamesTagsLocation, component: <Tags /> },
    {
      name: 'Signatures',
      location: [
        NamesSignaturesLocation,
        NamesSignaturesFunctionsLocation,
        NamesSignaturesEventsLocation,
      ],
      component: <Signatures />,
    },
    { name: 'Named Blocks', location: NamesBlocksLocation, component: <When /> },
  ];
  return <BaseView title='Names' cookieName='COOKIE_NAMES' tabs={tabs} />;
};
