const isObject = (value: unknown): value is object => typeof value === 'object';

type CreateTraverser = (configuration: {
  maxDeep: number,
  onTooDeep: () => Tree
  onEmpty: () => Tree
}) => TraverseObject;

type Tree = [] | Primitive | Branch[]
type Branch = [string, Tree]
export type TraverseObject = (value: InputValue, count?: number) => Tree

type InputValue = Record<string, Primitive | NonPrimitive> | Primitive | Primitive[] | []
type Primitive = string | number | boolean;
type NonPrimitive = {} | []

export const createTraverser: CreateTraverser = (configuration) => {
  const traverseObject: TraverseObject = (value, count = 0) => {
    if (count > configuration.maxDeep) {
      return configuration.onTooDeep();
    }

    if (!isObject(value)) {
      return value;
    }

    const objectTarget = Array.isArray(value) ? Object.fromEntries(Object.entries(value)) : value;

    const entries = Object.entries(objectTarget);
    return entries.map(([key, itemValue]) => [
      key,
      traverseObject(itemValue, count + 1),
    ]);
  };
  return traverseObject;
};
