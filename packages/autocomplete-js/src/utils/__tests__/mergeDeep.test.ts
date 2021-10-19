import { mergeDeep } from '../mergeDeep';

describe('mergeDeep', () => {
  test('arrays', () => {
    expect(mergeDeep({ key: ['test1'] }, { key: ['test2'] })).toEqual({
      key: ['test1', 'test2'],
    });
  });

  test('plain objects', () => {
    expect(
      mergeDeep({ key: { test1: 'value1' } }, { key: { test2: 'value2' } })
    ).toEqual({
      key: { test1: 'value1', test2: 'value2' },
    });
  });

  test('HTML Elements', () => {
    expect(
      mergeDeep(
        { key: document.createElement('div') },
        { key: document.createElement('span') }
      )
    ).toEqual({
      key: document.createElement('span'),
    });
  });

  test('primitives', () => {
    expect(mergeDeep({ key: 1 }, { key: 2 })).toEqual({
      key: 2,
    });
  });

  test('null', () => {
    expect(mergeDeep({ key: 1 }, { key: null })).toEqual({
      key: null,
    });
  });

  test('undefined', () => {
    expect(mergeDeep({ key: 1 }, { key: undefined })).toEqual({
      key: undefined,
    });
  });
});
