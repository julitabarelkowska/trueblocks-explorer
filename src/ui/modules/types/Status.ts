import { Status } from 'trueblocks-sdk';

export function createEmptyStatus(): Status {
  return {
    clientVersion: '',
    clientIds: '',
    trueblocksVersion: '',
    rpcProvider: '',
    configPath: '',
    cachePath: '',
    indexPath: '',
    host: '',
    isTesting: false,
    isApi: false,
    isScraping: false,
    isArchive: false,
    isTracing: false,
    hasEskey: false,
    hasPinkey: false,
    ts: 0,
    caches: [
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
      {
        items: [],
        type: '',
        path: '',
        nFiles: 0,
        nFolders: 0,
        sizeInBytes: 0,
      },
    ],
    chains: [],
    keys: [],
  };
}
