import { Config } from 'trueblocks-sdk';

export function createEmptyStatus(): Config {
  return {
    clientVersion: '',
    version: '',
    rpcProvider: '',
    cachePath: '',
    indexPath: '',
    isTesting: false,
    isApi: false,
    isScraping: false,
    isArchive: false,
    isTracing: false,
    hasEsKey: false,
    hasPinKey: false,
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
  };
}
