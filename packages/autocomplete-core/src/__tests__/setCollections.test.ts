import { createAutocomplete } from '..';

function createCollection<TItem extends { label: string }>(
  items: TItem[] | TItem[][] = []
): any {
  return {
    source: {
      sourceId: 'testSource',
      getItemInputValue: ({ item }: any) => item.label,
      getItemUrl: () => undefined,
      onActive: () => {},
      onSelect: () => {},
      getItems: () => items,
    },
    items,
  };
}

describe('setCollections', () => {
  test('sets the collections', () => {
    const onStateChange = jest.fn();
    const { setCollections } = createAutocomplete({
      onStateChange,
    });

    setCollections([createCollection([{ label: 'hi' }])]);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          collections: [
            {
              items: [
                {
                  label: 'hi',
                  __autocomplete_id: 0,
                },
              ],
              source: expect.any(Object),
            },
          ],
        }),
      })
    );
  });

  test('flattens the collections', () => {
    const onStateChange = jest.fn();
    const { setCollections } = createAutocomplete({
      openOnFocus: true,
      onStateChange,
    });

    setCollections([createCollection([[{ label: 'hi' }]])]);

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          collections: [
            expect.objectContaining({
              items: [{ label: 'hi', __autocomplete_id: 0 }],
            }),
          ],
        }),
      })
    );
  });
  test('resets activeItemId when new collections have fewer items than the current index', () => {
    const onStateChange = jest.fn();
    const { setCollections, setActiveItemId } = createAutocomplete({
      onStateChange,
      initialState: {
        collections: [
          createCollection([
            { label: 'a' },
            { label: 'b' },
            { label: 'c' },
            { label: 'd' },
            { label: 'e' },
          ]),
        ],
      },
    });

    setActiveItemId(4);
    onStateChange.mockClear();

    setCollections([createCollection([{ label: 'x' }, { label: 'y' }])]);

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: null,
        }),
      })
    );
  });

  test('preserves activeItemId when new collections still contain enough items', () => {
    const onStateChange = jest.fn();
    const { setCollections, setActiveItemId } = createAutocomplete({
      onStateChange,
      initialState: {
        collections: [
          createCollection([
            { label: 'a' },
            { label: 'b' },
            { label: 'c' },
            { label: 'd' },
            { label: 'e' },
          ]),
        ],
      },
    });

    setActiveItemId(1);
    onStateChange.mockClear();

    setCollections([
      createCollection([{ label: 'x' }, { label: 'y' }, { label: 'z' }]),
    ]);

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 1,
        }),
      })
    );
  });

  test('resets activeItemId at the exact boundary (activeItemId === newItemsCount)', () => {
    const onStateChange = jest.fn();
    const { setCollections, setActiveItemId } = createAutocomplete({
      onStateChange,
      initialState: {
        collections: [
          createCollection([
            { label: 'a' },
            { label: 'b' },
            { label: 'c' },
          ]),
        ],
      },
    });

    // activeItemId 2 is the last valid index for 3 items (0, 1, 2)
    setActiveItemId(2);
    onStateChange.mockClear();

    // New collections have exactly 2 items, so valid indices are 0 and 1.
    // activeItemId 2 === newItemsCount 2, which is out of bounds.
    setCollections([createCollection([{ label: 'x' }, { label: 'y' }])]);

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: null,
        }),
      })
    );
  });

  test('resets activeItemId when new collections have zero items', () => {
    const onStateChange = jest.fn();
    const { setCollections, setActiveItemId } = createAutocomplete({
      onStateChange,
      initialState: {
        collections: [
          createCollection([
            { label: 'a' },
            { label: 'b' },
          ]),
        ],
      },
    });

    setActiveItemId(1);
    onStateChange.mockClear();

    // New collections are empty — any non-null activeItemId is out of bounds.
    setCollections([createCollection([])]);

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: null,
        }),
      })
    );
  });
});
