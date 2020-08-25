import { AutocompleteApi, AutocompleteStore } from './types';

interface GetAutocompleteSettersOptions<TItem> {
  store: AutocompleteStore<TItem>;
}

export function getAutocompleteSetters<TItem>({
  store,
}: GetAutocompleteSettersOptions<TItem>) {
  const setHighlightedIndex: AutocompleteApi<TItem>['setHighlightedIndex'] = (
    value
  ) => {
    store.send('setHighlightedIndex', value);
  };

  const setQuery: AutocompleteApi<TItem>['setQuery'] = (value) => {
    store.send('setQuery', value);
  };

  const setSuggestions: AutocompleteApi<TItem>['setSuggestions'] = (
    rawValue
  ) => {
    let baseItemId = 0;
    const value = rawValue.map((suggestion) => ({
      ...suggestion,
      items: suggestion.items.map((item) => ({
        ...item,
        __autocomplete_id: baseItemId++,
      })),
    }));

    store.send('setSuggestions', value);
  };

  const setIsOpen: AutocompleteApi<TItem>['setIsOpen'] = (value) => {
    store.send('setIsOpen', value);
  };

  const setStatus: AutocompleteApi<TItem>['setStatus'] = (value) => {
    store.send('setStatus', value);
  };

  const setContext: AutocompleteApi<TItem>['setContext'] = (value) => {
    store.send('setContext', value);
  };

  return {
    setHighlightedIndex,
    setQuery,
    setSuggestions,
    setIsOpen,
    setStatus,
    setContext,
  };
}
