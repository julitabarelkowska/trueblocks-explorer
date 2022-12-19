import { getNames, Name } from 'trueblocks-sdk';

import {
  isFailedCall, wrapResponse,
} from '@modules/api/call_status';

type FetchAll = (requestParams: Parameters<typeof getNames>[0]) => Promise<Name[]>;
export const fetchAll: FetchAll = async (requestParams) => {
  const call = wrapResponse(
    await getNames(requestParams),
  );

  if (isFailedCall(call)) {
    throw new Error(call.errors.join());
  }

  return call.data;
};
