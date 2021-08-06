import { flatten } from '@algolia/autocomplete-shared';

import {
  AutocompleteApi,
  AutocompleteCollection,
  AutocompleteStore,
  BaseItem,
} from './types';

interface GetAutocompleteSettersOptions<TItem extends BaseItem> {
  store: AutocompleteStore<TItem>;
}

export function getAutocompleteSetters<TItem extends BaseItem>({
  store,
}: GetAutocompleteSettersOptions<TItem>) {
  const setActiveItemId: AutocompleteApi<TItem>['setActiveItemId'] = (
    value
  ) => {
    store.dispatch('setActiveItemId', value);
  };

  const setQuery: AutocompleteApi<TItem>['setQuery'] = (value) => {
    store.dispatch('setQuery', value);
  };

  const setCollections: AutocompleteApi<TItem>['setCollections'] = (
    rawValue
  ) => {
    let baseItemId = 0;
    const value = rawValue.map<AutocompleteCollection<TItem>>((collection) => ({
      ...collection,
      // We flatten the stored items to support calling `getAlgoliaResults`
      // from the source itself.
      items: flatten(collection.items as any).map((item: any) => ({
        ...item,
        __autocomplete_id: baseItemId++,
      })),
    }));

    store.dispatch('setCollections', value);
  };

  const setIsOpen: AutocompleteApi<TItem>['setIsOpen'] = (value) => {
    store.dispatch('setIsOpen', value);
  };

  const setStatus: AutocompleteApi<TItem>['setStatus'] = (value) => {
    store.dispatch('setStatus', value);
  };

  const setContext: AutocompleteApi<TItem>['setContext'] = (value) => {
    store.dispatch('setContext', value);
  };

  return {
    setActiveItemId,
    setQuery,
    setCollections,
    setIsOpen,
    setStatus,
    setContext,
  };
}
