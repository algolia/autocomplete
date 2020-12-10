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
  }
});
