import { createAutocomplete, AutocompleteSuggestion } from '..';

function createSuggestion<TItem extends { label: string }>(
  items: TItem[] = []
): AutocompleteSuggestion<TItem> {
  return {
    source: {
      getInputValue: ({ suggestion }) => suggestion.label,
      getSuggestionUrl: () => undefined,
      onHighlight: () => {},
      onSelect: () => {},
      getSuggestions: () => items,
    },
    items,
  };
}

describe('createAutocomplete', () => {
  test('setHighlightedIndex', () => {
    const onStateChange = jest.fn();
    const { setHighlightedIndex } = createAutocomplete({
      getSources: () => [],
      onStateChange,
    });

    setHighlightedIndex(1);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ highlightedIndex: 1 }),
      })
    );

    setHighlightedIndex(null);

    expect(onStateChange).toHaveBeenCalledTimes(2);
    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ highlightedIndex: null }),
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

  describe('setSuggestions', () => {
    test('default', () => {
      const onStateChange = jest.fn();
      const { setSuggestions } = createAutocomplete({
        getSources: () => [],
        onStateChange,
      });

      setSuggestions([createSuggestion([{ label: 'hi' }])]);

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith({
        state: expect.objectContaining({
          suggestions: [
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
      const { setSuggestions } = createAutocomplete({
        openOnFocus: true,
        getSources: () => [],
        onStateChange,
      });

      // @ts-expect-error AutocompleteSuggestion has an array of items
      // while it also accepts a nested array.
      // There's only one type for both input and output however,
      setSuggestions([createSuggestion([[{ label: 'hi' }]])]);

      expect(onStateChange).toHaveBeenCalledWith({
        state: expect.objectContaining({
          suggestions: [
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
