import { createTraverser } from './traverse';

let traverseObject: ReturnType<typeof createTraverser>;
const config = {
  maxDeep: 4,
  onTooDeep: () => 'too deep',
  onEmpty: () => 'empty',
};

describe('traverse', () => {
  beforeEach(() => {
    traverseObject = createTraverser(config);
  });

  test('simple primitive value', () => {
    const result = traverseObject('hello');
    expect(result).toBe('hello');
  });

  test('empty value', () => {
    const result = traverseObject({});
    expect(result).toEqual([]);
  });

  test('simple object', () => {
    const result = traverseObject({
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
    const result = traverseObject([
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
    const result = traverseObject({
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
    const traverse = createTraverser({
      ...config,
      maxDeep: 1,
    });
    const result = traverse({
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
