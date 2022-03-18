import { createMakeTreeFromObject } from './fromObject';

let makeTreeFromObject: ReturnType<typeof createMakeTreeFromObject>;
const config = {
  maxDeep: 4,
};

describe('makeTreeFromObject', () => {
  beforeEach(() => {
    makeTreeFromObject = createMakeTreeFromObject(config);
  });

  test('simple primitive value', () => {
    const result = makeTreeFromObject('hello');
    expect(result).toEqual({
      kind: 'value',
      key: '',
      value: 'hello',
    });
  });

  test('empty value', () => {
    const result = makeTreeFromObject({});
    expect(result).toEqual([]);
  });

  test('simple object', () => {
    const result = makeTreeFromObject({
      key1: 1,
      key2: 2,
    });
    expect(result).toEqual([
      {
        kind: 'property',
        key: 'key1',
        value: {
          kind: 'value',
          key: '',
          value: 1,
        },
      },
      {
        kind: 'property',
        key: 'key2',
        value: {
          kind: 'value',
          key: '',
          value: 2,
        },
      },
    ]);
  });

  test('simple array', () => {
    const result = makeTreeFromObject([
      'a', 'b', 'c',
    ]);
    expect(result).toEqual({
      kind: 'array',
      key: '',
      value: [
        {
          kind: 'value',
          key: '',
          value: 'a',
        },
        {
          kind: 'value',
          key: '',
          value: 'b',
        },
        {
          kind: 'value',
          key: '',
          value: 'c',
        },
      ],
    });
  });

  test('simple nested object', () => {
    const result = makeTreeFromObject({
      key1: {
        nested: 'nested value',
        another: 'another value',
      },
      key2: [
        'nested item 1',
        'nested item 2',
      ],
    });
    expect(result).toEqual([
      {
        kind: 'property',
        key: 'key1',
        value: [
          {
            kind: 'property',
            key: 'nested',
            value: {
              kind: 'value',
              key: '',
              value: 'nested value',
            },
          },
          {
            kind: 'property',
            key: 'another',
            value: {
              kind: 'value',
              key: '',
              value: 'another value',
            },
          },
        ],
      },
      {
        kind: 'property',
        key: 'key2',
        value: {
          kind: 'array',
          key: '',
          value: [
            {
              kind: 'value',
              key: '',
              value: 'nested item 1',
            },
            {
              kind: 'value',
              key: '',
              value: 'nested item 2',
            },
          ],
        },
      },
    ]);
  });

  test('too deep', () => {
    const makeTreeFromObjectNotDeep = createMakeTreeFromObject({
      ...config,
      maxDeep: 1,
    });
    const result = makeTreeFromObjectNotDeep({
      level1: {
        level2: {
          level3: 'some value',
        },
      },
    });
    expect(result).toEqual([{
      kind: 'property',
      key: 'level1',
      value: [{
        kind: 'property',
        key: 'level2',
        value: { kind: 'tooDeep' },
      }],
    }]);
  });
});
