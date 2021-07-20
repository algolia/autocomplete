import { decycle } from '../decycle';

describe('decycle', () => {
  test('leaves objects with no circular references intact', () => {
    const obj = { a: 1 };
    const subject = {
      a: 'b',
      c: { d: [obj, () => {}, null, false, undefined] },
    };

    expect(decycle(subject)).toEqual({
      a: 'b',
      c: { d: [{ a: 1 }, expect.any(Function), null, false, undefined] },
    });
  });
  test('replaces circular references', () => {
    const circular = { a: 'b', self: null };
    circular.self = circular;

    expect(decycle(circular)).toEqual({ a: 'b', self: '[Circular]' });
  });
});
