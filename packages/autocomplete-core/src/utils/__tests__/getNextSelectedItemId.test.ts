import { getNextSelectedItemId } from '../getNextSelectedItemId';

describe('getNextSelectedItemId', () => {
  type GetNextSelectedItemIdParams = {
    moveAmount: number;
    baseIndex: number | null;
    itemCount: number;
    defaultSelectedItemId: number | null;
  };

  function getParams(x: GetNextSelectedItemIdParams) {
    return [
      x.moveAmount,
      x.baseIndex,
      x.itemCount,
      x.defaultSelectedItemId,
    ] as const;
  }

  describe('going forward', () => {
    const moveAmount = 1;

    test('returns index 0 from null base index', () => {
      const params = getParams({
        moveAmount,
        baseIndex: null,
        itemCount: 2,
        defaultSelectedItemId: null,
      });

      expect(getNextSelectedItemId(...params)).toEqual(0);
    });

    test('returns index 1 from 0 base index', () => {
      const params = getParams({
        moveAmount,
        baseIndex: 0,
        itemCount: 2,
        defaultSelectedItemId: null,
      });

      expect(getNextSelectedItemId(...params)).toEqual(1);
    });

    test('returns defaultSelectedItemId (null) from last base index', () => {
      const params = getParams({
        moveAmount,
        baseIndex: 1,
        itemCount: 2,
        defaultSelectedItemId: null,
      });

      expect(getNextSelectedItemId(...params)).toEqual(null);
    });

    test('returns defaultSelectedItemId (0) from last base index', () => {
      const params = getParams({
        moveAmount,
        baseIndex: 1,
        itemCount: 2,
        defaultSelectedItemId: 0,
      });

      expect(getNextSelectedItemId(...params)).toEqual(0);
    });
  });

  describe('going backward', () => {
    const moveAmount = -1;

    test('returns last index from null base index', () => {
      const params = getParams({
        moveAmount,
        baseIndex: null,
        itemCount: 2,
        defaultSelectedItemId: null,
      });

      expect(getNextSelectedItemId(...params)).toEqual(1);
    });

    test('returns index 0 from index 1', () => {
      const params = getParams({
        moveAmount,
        baseIndex: 1,
        itemCount: 2,
        defaultSelectedItemId: null,
      });

      expect(getNextSelectedItemId(...params)).toEqual(0);
    });

    test('returns index null from index 0', () => {
      const params = getParams({
        moveAmount,
        baseIndex: 0,
        itemCount: 2,
        defaultSelectedItemId: null,
      });

      expect(getNextSelectedItemId(...params)).toEqual(null);
    });

    test('returns last index from index 0 with defaultSelectedItemId', () => {
      const params = getParams({
        moveAmount,
        baseIndex: 0,
        itemCount: 2,
        defaultSelectedItemId: 0,
      });

      expect(getNextSelectedItemId(...params)).toEqual(1);
    });
  });
});
