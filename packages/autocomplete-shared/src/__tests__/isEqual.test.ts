import { isEqual } from '../isEqual';

describe('isEqual', () => {
  describe('with primitives', () => {
    test('with null should be true', () => {
      const first = null;
      const second = null;

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with undefined should be true', () => {
      const first = undefined;
      const second = undefined;

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with same booleans should be true', () => {
      const first = true;
      const second = true;

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different booleans should be false', () => {
      const first = true;
      const second = false;

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with same numbers should be true', () => {
      const first = 1;
      const second = 1;

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different numbers should be false', () => {
      const first = 1;
      const second = 2;

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with same strings should be true', () => {
      const first = 'string';
      const second = 'string';

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different strings should be false', () => {
      const first = 'string1';
      const second = 'string2';

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with same symbols should be true', () => {
      const first = Symbol('42');
      const second = first;

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different symbols should be false', () => {
      const first = Symbol('42');
      const second = Symbol('42');

      expect(isEqual(first, second)).toEqual(false);
    });
  });

  describe('with functions', () => {
    test('with same functions should be true', () => {
      const first = function a(): void {};
      const second = first;

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different functions should be false', () => {
      const first = function a(): void {};
      const second = function a(): void {};

      expect(isEqual(first, second)).toEqual(false);
    });
  });

  describe('with arrays', () => {
    test('with same array values should be true', () => {
      const first = ['Alphonse', 'Fred'];
      const second = ['Alphonse', 'Fred'];

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different array values should be false', () => {
      const first = ['Alphonse', 'Fred'];
      const second = ['Adeline', 'Fred'];

      expect(isEqual(first, second)).toEqual(false);
    });
  });

  describe('with objects', () => {
    test('with same reference should be true', () => {
      const first = { name: 'Alfred' };
      const second = first;

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different number of keys should be false', () => {
      const first = { name: 'Alfred' };
      const second = { name: 'Alfred', age: 33 };

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with different keys types should be false', () => {
      const first = { name: 'Alfred', age: 33 };
      const second = { name: 'Alfred', age: '33' };

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with different keys should be false', () => {
      const first = { name: 'Alfred' };
      const second = { firstName: 'Alfred' };

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with different values should be false', () => {
      const first = { name: 'Alfred' };
      const second = { name: 'Georges' };

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with equal nested objects should be true', () => {
      const first = { name: { first: 'John', last: 'Doe' } };
      const second = { name: { first: 'John', last: 'Doe' } };

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with different nested objects should be false', () => {
      const first = { name: { first: 'John', last: 'Doe' } };
      const second = { name: { first: 'Jane', last: 'Doe' } };

      expect(isEqual(first, second)).toEqual(false);
    });

    test('with full equal objects should be true', () => {
      const first = {
        index: '',
        query: '',
        facets: [],
        facetsRefinements: {},
        tagRefinements: [],
        numericFilters: undefined,
      };

      const second = {
        index: '',
        query: '',
        facets: [],
        facetsRefinements: {},
        tagRefinements: [],
        numericFilters: undefined,
      };

      expect(isEqual(first, second)).toEqual(true);
    });

    test('with full different objects should be false', () => {
      const first = {
        index: '',
        query: 'first query',
        facets: [],
        facetsRefinements: {},
        tagRefinements: [],
        numericFilters: undefined,
      };

      const second = {
        index: '',
        query: '',
        facets: ['brand'],
        facetsRefinements: {},
        tagRefinements: [],
        numericFilters: undefined,
      };

      expect(isEqual(first, second)).toEqual(false);
    });
  });
});
