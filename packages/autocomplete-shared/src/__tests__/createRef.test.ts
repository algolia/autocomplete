import { createRef } from '../createRef';

describe('createRef', () => {
  test('stores the value in current', () => {
    const ref = createRef(null);

    expect(ref).toEqual({ current: null });
  });

  test('makes the current value mutable', () => {
    const ref = createRef<string | null>(null);
    ref.current = 'updated';

    expect(ref.current).toEqual('updated');
  });
});
