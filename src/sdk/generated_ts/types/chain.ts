import { uint64 } from "../types";

export type Chain = {
  chain: string
  chainId: uint64
  symbol: string
  rpcProvider: string
  apiProvider: string
  remoteExplorer: string
  localExplorer: string
  ipfsGateway: string
}
