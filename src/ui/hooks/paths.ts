import { useCallback } from 'react';
import { generatePath } from 'react-router-dom';

import { useGlobalState } from '@state';

export function usePathWithAddress() {
  const { currentAddress } = useGlobalState();
  return useCallback((pathname: string) => generatePath(pathname, {
    address: currentAddress,
  }), [currentAddress]);
}
