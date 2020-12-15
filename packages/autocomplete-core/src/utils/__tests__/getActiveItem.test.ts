import {
  createCollection,
  createSource,
  createState,
} from '../../../../../test/utils';
import { getActiveItem } from '../getActiveItem';

describe('getActiveItem', () => {
  test('returns null with empty collections', () => {
    const state = createState();

    expect(getActiveItem(state)).toEqual(null);
  });

  test('returns item from first collection', () => {
    const item1 = { label: '1', url: '#1' };
    const source1 = createSource<{ label: string; url: string }>({
      getItems() {
        return [item1];
      },
      getItemInputValue({ item }) {
        return item.label;
      },
      getItemUrl({ item }) {
        return item.url;
      },
    });
    const state = createState({
      activeItemId: 0,
      collections: [
        createCollection({
          source: source1,
          items: [item1],
        }),
      ],
    });

    expect(getActiveItem(state)).toEqual({
      item: item1,
      itemInputValue: '1',
      itemUrl: '#1',
      source: source1,
    });
  });

  test('returns item from second collection', () => {
    const item1 = { label: '1', url: '#1' };
    const item2 = { label: '2', url: '#2' };
    const source1 = createSource<{ label: string; url: string }>({
      getItems() {
        return [item1];
      },
      getItemInputValue({ item }) {
        return item.label;
      },
      getItemUrl({ item }) {
        return item.url;
      },
    });
    const source2 = createSource<{ label: string; url: string }>({
      getItems() {
        return [item2];
      },
      getItemInputValue({ item }) {
        return item.label;
      },
      getItemUrl({ item }) {
        return item.url;
      },
    });
    const state = createState({
      activeItemId: 1,
      collections: [
        createCollection({
          source: source1,
          items: [item1],
        }),
        createCollection({
          source: source2,
          items: [item2],
        }),
      ],
    });

    expect(getActiveItem(state)).toEqual({
      item: item2,
      itemInputValue: '2',
      itemUrl: '#2',
      source: source2,
    });
  });
});
