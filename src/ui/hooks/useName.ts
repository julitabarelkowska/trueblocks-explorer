import { useEffect } from 'react';

import { address, Name } from 'trueblocks-sdk';

import { useDatastore } from './useDatastore';

type UseName = (addresses: address[], callback: Callback) => void;
type Callback = (names: Array<Name | undefined>) => void;
export const useName: UseName = (addresses, callback) => {
  const {
    getNameFor,
  } = useDatastore();

  useEffect(() => {
    let cancelled = false;
    const promises = addresses
      .map(async (someAddress) => (getNameFor({ address: someAddress }) as Promise<Name | undefined>));

    (async () => {
      const names = await Promise.all(promises);
      if (cancelled) return;
      callback(names);
    })();
    return () => { cancelled = true; };
  }, [addresses, callback, getNameFor]);
};
