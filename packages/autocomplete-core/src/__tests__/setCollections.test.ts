import { createAutocomplete, AutocompleteCollection } from '..';

function createCollection<TItem extends { label: string }>(
  items: TItem[] | TItem[][] = []
): AutocompleteCollection<TItem | TItem[]> | AutocompleteCollection<TItem[]> {
  return {
    source: {
      getItemInputValue: ({ item }) => item.label,
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
});
