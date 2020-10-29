import { flatten } from '../utils';

describe('flatten', () => {
  it('does not split strings', () => {
    expect(flatten(['value', 'value'])).toEqual(['value', 'value']);
  });

  it('spreads arrays', () => {
    expect(flatten(['value', ['value']])).toEqual(['value', 'value']);
  });

  it('ignores empty arrays', () => {
    expect(flatten([[], 'value', 'value'])).toEqual(['value', 'value']);
  });
});
