import {
  NamesAddressesLocation,
  NamesBlocksLocation,
  NamesEventSigsLocation,
  NamesFuncSigsLocation,
  NamesTagsLocation,
} from '../../Routes';
import { Addresses } from './Tabs/Addresses';
import { EventSignatures } from './Tabs/EventSignatures';
import { FunctionSignatures } from './Tabs/FunctionSignatures';
import { Tags } from './Tabs/Tag';
import { When } from './Tabs/When';
import { BaseView } from '@components/BaseView';
import React from 'react';

export const NamesView = () => {
  const title = 'Names';
  const tabs = [
    { name: 'Named Addresses', location: NamesAddressesLocation, component: <Addresses /> },
    { name: 'Address Tags', location: NamesTagsLocation, component: <Tags /> },
    { name: 'Function Signatures', location: NamesFuncSigsLocation, component: <FunctionSignatures /> },
    { name: 'Event Signatures', location: NamesEventSigsLocation, component: <EventSignatures /> },
    { name: 'Named Blocks', location: NamesBlocksLocation, component: <When /> },
  ];

  return <BaseView title={title} cookieName={'COOKIE_NAMES'} tabs={tabs} />;
};
