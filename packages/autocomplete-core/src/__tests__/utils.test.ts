import { flatten } from '../utils';

describe('flatten', () => {
  it('flattens only values', () => {
    expect(flatten(['value', 'value'])).toEqual(['value', 'value']);
  });

  it('flattens arrays mixed with nested arrays', () => {
    expect(flatten(['value', ['value']])).toEqual(['value', 'value']);
  });

  it('ignores empty nested arrays', () => {
    expect(flatten([[], 'value', 'value'])).toEqual(['value', 'value']);
  });
});
