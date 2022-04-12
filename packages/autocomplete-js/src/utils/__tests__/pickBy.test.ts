import { pickBy } from '../pickBy';

describe('pickBy', () => {
  test('picks object properties using the passed predicate', () => {
    expect(
      pickBy(
        { a: true, b: false, cd: true },
        ({ key, value }) => value && key.length === 1
      )
    ).toEqual({
      a: true,
    });
  });
});
