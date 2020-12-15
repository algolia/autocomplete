import { AutocompleteState } from '@algolia/autocomplete-core';
import { BaseItem } from '@algolia/autocomplete-core/src';

export function createState<TItem extends BaseItem>(
  partialState: Partial<AutocompleteState<TItem>> = {}
): AutocompleteState<TItem> {
  return {
    activeItemId: null,
    query: '',
    completion: null,
    collections: [],
    isOpen: false,
    status: 'idle',
    context: {},
    ...partialState,
  };
}
