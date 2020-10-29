import { AutocompleteApi, AutocompleteStore } from './types';
import { flatten } from './utils';

interface GetAutocompleteSettersOptions<TItem> {
  store: AutocompleteStore<TItem>;
}

export function getAutocompleteSetters<TItem>({
  store,
}: GetAutocompleteSettersOptions<TItem>) {
  const setSelectedItemId: AutocompleteApi<TItem>['setSelectedItemId'] = (
    value
  ) => {
    store.send('setSelectedItemId', value);
  };

  const setQuery: AutocompleteApi<TItem>['setQuery'] = (value) => {
    store.send('setQuery', value);
  };

  const setCollections: AutocompleteApi<TItem>['setCollections'] = (
    rawValue
  ) => {
    let baseItemId = 0;
    const value = rawValue.map((collection) => ({
      ...collection,
      // We flatten the stored items to support calling `getAlgoliaHits`
      // from the source itself.
      items: flatten(collection.items).map((item) => ({
        ...item,
        __autocomplete_id: baseItemId++,
      })),
    }));

    store.send('setCollections', value);
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
    setSelectedItemId,
    setQuery,
    setCollections,
    setIsOpen,
    setStatus,
    setContext,
  };
}
