import { createMakeTreeFromObject } from './fromObject';

let makeTreeFromObject: ReturnType<typeof createMakeTreeFromObject>;
const config = {
  maxDeep: 4,
  onTooDeep: () => 'too deep',
  onEmpty: () => 'empty',
};

describe('makeTreeFromObject', () => {
  beforeEach(() => {
    makeTreeFromObject = createMakeTreeFromObject(config);
  });

  test('simple primitive value', () => {
    const result = makeTreeFromObject('hello');
    expect(result).toBe('hello');
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
      [
        'key1',
        1,
      ],
      [
        'key2',
        2,
      ],
    ]);
  });

  test('simple array', () => {
    const result = makeTreeFromObject([
      'a', 'b', 'c',
    ]);
    expect(result).toEqual([
      [
        '0',
        'a',
      ],
      [
        '1',
        'b',
      ],
      [
        '2',
        'c',
      ],
    ]);
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
      [
        'key1',
        [
          [
            'nested',
            'nested value',
          ],
          [
            'another',
            'another value',
          ],
        ],
      ],
      [
        'key2',
        [
          [
            '0',
            'nested item 1',
          ],
          [
            '1',
            'nested item 2',
          ],
        ],
      ],
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
    expect(result).toEqual([
      [
        'level1',
        [
          [
            'level2',
            config.onTooDeep(),
          ],
        ],
      ],
    ]);
  });
});
