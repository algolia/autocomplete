import { createAutocomplete } from '../createAutocomplete';

describe('onStateChange', () => {
  test('gets called at any store change', () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({ onStateChange });

    autocomplete.setQuery('query');

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenCalledWith({
      prevState: {
        activeItemId: null,
        collections: [],
        completion: null,
        context: {},
        isOpen: false,
        query: '',
        status: 'idle',
      },
      state: {
        activeItemId: null,
        collections: [],
        completion: null,
        context: {},
        isOpen: false,
        query: 'query',
        status: 'idle',
      },
      navigator: autocomplete.navigator,
      refresh: autocomplete.refresh,
      setActiveItemId: autocomplete.setActiveItemId,
      setCollections: autocomplete.setCollections,
      setContext: autocomplete.setContext,
      setIsOpen: autocomplete.setIsOpen,
      setQuery: autocomplete.setQuery,
      setStatus: autocomplete.setStatus,
    });
  });
});
