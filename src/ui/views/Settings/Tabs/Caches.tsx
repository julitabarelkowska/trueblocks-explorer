import { useGlobalState } from '../../../State';
import React from 'react';

export const Caches = () => {
  const { theme } = useGlobalState();

  return <h4 style={{ color: theme ? theme.primaryColor : '#000' }}>Caches</h4>;
};
