import { createCollection, createState } from '../../../../test/utils';
import { getItemsCount } from '../getItemsCount';

describe('getItemsCount', () => {
  test('returns 0 with empty collection', () => {
    const state = createState();

    expect(getItemsCount(state)).toEqual(0);
  });

  test('returns the number of items with a single collection', () => {
    const state = createState({
      collections: [
        createCollection({ items: [{ label: '1' }, { label: '2' }] }),
      ],
    });

    expect(getItemsCount(state)).toEqual(2);
  });

  test('returns the number of items with multiple collections', () => {
    const state = createState({
      collections: [
        createCollection({ items: [{ label: '1' }, { label: '2' }] }),
        createCollection({ items: [{ label: '1' }, { label: '2' }] }),
      ],
    });

    expect(getItemsCount(state)).toEqual(4);
  });
});
