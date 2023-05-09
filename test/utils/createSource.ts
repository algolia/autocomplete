import {
  AutocompleteSource,
  BaseItem,
  InternalAutocompleteSource,
} from '@algolia/autocomplete-core';

export function createSource<TItem extends BaseItem>(
  source?: Partial<AutocompleteSource<TItem>>
): InternalAutocompleteSource<TItem> {
  return {
    sourceId: 'testSource',
    getItemInputValue: ({ state }) => state.query,
    getItemUrl: () => undefined,
    onActive: () => {},
    onSelect: () => {},
    onResolve: () => {},
    getItems: () => [],
    ...source,
  };
}
