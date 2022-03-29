import { AutocompleteState, BaseItem } from '@algolia/autocomplete-core';

export function hasSourceActiveItem<TItem extends BaseItem>(
  sourceId: string,
  state: AutocompleteState<TItem>
) {
  return Boolean(
    state.collections.find(
      (collection) =>
        collection.source.sourceId === sourceId &&
        collection.items.find(
          (item) => item.__autocomplete_id === state.activeItemId
        )
    )
  );
}
