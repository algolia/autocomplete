import { decycle } from '../decycle';

describe('decycle', () => {
  if (__DEV__) {
    test('leaves objects with no circular references intact', () => {
      const ref = { a: 1 };
      const obj = {
        a: 'b',
        c: { d: [ref, () => {}, null, false, undefined] },
      };

      expect(decycle(obj)).toEqual({
        a: 'b',
        c: { d: [{ a: 1 }, expect.any(Function), null, false, undefined] },
      });
    });
    test('replaces circular references', () => {
      const circular = { a: 'b', self: null };
      circular.self = circular;

      expect(decycle(circular)).toEqual({ a: 'b', self: '[Circular]' });
    });
  }
});
