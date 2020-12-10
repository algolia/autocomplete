import { noop } from '../noop';

describe('noop', () => {
  test('does nothing', () => {
    expect(noop).toBeInstanceOf(Function);
    expect(noop()).toBeUndefined();
    // Checks that `noop` acts like a function.
    expect(noop.toString).toBe(Function.prototype.toString);
  });
});
