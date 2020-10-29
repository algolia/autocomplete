import { createAutocomplete, AutocompleteCollection } from '..';

function createCollection<TItem extends { label: string }>(
  items: TItem[] | TItem[][] = []
): AutocompleteCollection<TItem | TItem[]> | AutocompleteCollection<TItem[]> {
  return {
    source: {
      getItemInputValue: ({ item }) => item.label,
      getItemUrl: () => undefined,
      onHighlight: () => {},
      onSelect: () => {},
      getItems: () => items,
    },
    items,
  };
}

describe('createAutocomplete', () => {
  test('setSelectedItemId', () => {
    const onStateChange = jest.fn();
    const { setSelectedItemId } = createAutocomplete({
      getSources: () => [],
      onStateChange,
    });

    setSelectedItemId(1);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ selectedItemId: 1 }),
      })
    );

    setSelectedItemId(null);

    expect(onStateChange).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ selectedItemId: null }),
      })
    );
  });

  test('setQuery', () => {
    const onStateChange = jest.fn();
    const { setQuery } = createAutocomplete({
      getSources: () => [],
      onStateChange,
    });

    setQuery('query');

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ query: 'query' }),
      })
    );
  });

  describe('setCollections', () => {
    test('default', () => {
      const onStateChange = jest.fn();
      const { setCollections } = createAutocomplete({
        getSources: () => [],
        onStateChange,
      });

      setCollections([createCollection([{ label: 'hi' }])]);

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith({
        prevState: expect.any(Object),
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
      });
    });

    test('flattens suggestions', () => {
      const onStateChange = jest.fn();
      const { setCollections } = createAutocomplete({
        openOnFocus: true,
        getSources: () => [],
        onStateChange,
      });

      setCollections([createCollection([[{ label: 'hi' }]])]);

      expect(onStateChange).toHaveBeenCalledWith({
        prevState: expect.any(Object),
        state: expect.objectContaining({
          collections: [
            expect.objectContaining({
              items: [{ label: 'hi', __autocomplete_id: 0 }],
            }),
          ],
        }),
      });
    });
  });

  test('setIsOpen', () => {
    const onStateChange = jest.fn();
    const { setIsOpen } = createAutocomplete({
      getSources: () => [],
      onStateChange,
    });

    setIsOpen(true);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ isOpen: true }),
      })
    );
  });

  test('setStatus', () => {
    const onStateChange = jest.fn();
    const { setStatus } = createAutocomplete({
      getSources: () => [],
      onStateChange,
    });

    setStatus('stalled');

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ status: 'stalled' }),
      })
    );
  });

  test('setContext', () => {
    const onStateChange = jest.fn();
    const { setContext } = createAutocomplete({
      getSources: () => [],
      onStateChange,
    });

    setContext({ nbArticles: 10 });

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ context: { nbArticles: 10 } }),
      })
    );

    setContext({ nbProducts: 30 });

    expect(onStateChange).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          context: { nbArticles: 10, nbProducts: 30 },
        }),
      })
    );
  });
});
