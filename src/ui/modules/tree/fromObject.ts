const isObject = (value: unknown): value is object => typeof value === 'object';

type CreateMakeTreeFromObject = (configuration: {
  maxDeep: number,
}) => MakeTreeFromObject;

type Tree = [] | Node | Node[] | TooDeep;
export type Node =
  | PropertyNode
  | ArrayNode
  | ValueNode

type PropertyNode = {
  kind: 'property',
  key: string,
  value: Tree
}

export type ArrayNode = {
  kind: 'array',
  key: '',
  value: Tree[]
}

type ValueNode = {
  kind: 'value',
  key: '',
  value: Primitive,
}

export type TooDeep = {
  kind: 'tooDeep',
};

export type MakeTreeFromObject = (value: InputValue, count?: number) => Tree

type InputValue = Record<string, Primitive | NonPrimitive> | Primitive | Primitive[] | []
type Primitive = string | number | boolean;
type NonPrimitive = {} | []

export const createMakeTreeFromObject: CreateMakeTreeFromObject = (configuration) => {
  const makeTreeFromObject: MakeTreeFromObject = (value, count = 0) => {
    if (count > configuration.maxDeep) {
      return { kind: 'tooDeep' };
    }

    if (!isObject(value)) {
      const r: Node = {
        kind: 'value',
        key: '',
        value,
      };
      return r;
    }

    if (Array.isArray(value)) {
      const r: Node = {
        kind: 'array',
        key: '',
        // @ts-ignore
        value: value.map((itemValue) => makeTreeFromObject(itemValue, count + 1)),
      };
      return r;
    }

    return Object.entries(value).map(([key, itemValue]) => ({
      kind: 'property',
      key,
      value: makeTreeFromObject(itemValue, count + 1),
    }));
  };
  return makeTreeFromObject;
};
