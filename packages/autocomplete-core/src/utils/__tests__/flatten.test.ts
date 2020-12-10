import { flatten } from '../flatten';

describe('flatten', () => {
  it('does not split strings', () => {
    expect(flatten(['value', 'value'])).toEqual(['value', 'value']);
  });

  it('spreads single array', () => {
    expect(flatten(['value', ['value']])).toEqual(['value', 'value']);
  });

  it('spreads multiple arrays', () => {
    expect(flatten([['value'], ['value']])).toEqual(['value', 'value']);
  });

  it('ignores empty arrays', () => {
    expect(flatten([[], 'value', 'value'])).toEqual(['value', 'value']);
  });
});
