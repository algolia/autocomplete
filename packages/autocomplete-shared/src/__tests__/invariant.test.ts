import { invariant } from '../invariant';

describe('invariant', () => {
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
});
