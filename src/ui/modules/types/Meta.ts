export type Meta = {
  unripe: number,
  ripe: number,
  staging: number,
  finalized: number,
  client: number,
}

export function createEmptyMeta() {
  return {
    unripe: 0,
    ripe: 0,
    staging: 0,
    finalized: 0,
    client: 0,
  };
}
