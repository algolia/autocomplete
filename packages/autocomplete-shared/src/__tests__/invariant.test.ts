import { invariant } from '../invariant';

describe('invariant', () => {
  if (__DEV__) {
    test('throws when the condition is unmet', () => {
      expect(() => {
        invariant(false, 'invariant');
      }).toThrow('[Autocomplete] invariant');
    });

    test('does not throw when the condition is met', () => {
      expect(() => {
        invariant(true, 'invariant');
      }).not.toThrow();
    });

    test('lazily instantiates message', () => {
      const spy1 = jest.fn(() => 'invariant');
      const spy2 = jest.fn(() => 'invariant');

      expect(() => {
        invariant(false, spy1);
      }).toThrow('[Autocomplete] invariant');

      expect(spy1).toHaveBeenCalledTimes(1);

      expect(() => {
        invariant(true, spy2);
      }).not.toThrow('[Autocomplete] invariant');

      expect(spy2).not.toHaveBeenCalled();
    });
  }
});
