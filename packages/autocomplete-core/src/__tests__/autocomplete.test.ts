import { createAutocomplete } from '..';

function createCollection(items = []) {
  return {
    source: {
      getItemInputValue: ({ suggestion }) => suggestion.label,
      getItemUrl: () => undefined,
      onHighlight: () => {},
      onSelect: () => {},
      getSuggestions: () => items,
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

  test('setCollections', () => {
    const onStateChange = jest.fn();
    const { setCollections } = createAutocomplete({
      getSources: () => [],
      onStateChange,
    });
    const collections = [createCollection()];

    setCollections(collections);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ collections }),
      })
    );
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
