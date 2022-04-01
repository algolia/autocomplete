import {
  AutocompleteReshapeSource,
  BaseItem,
} from '@algolia/autocomplete-core';
import { flatten } from '@algolia/autocomplete-shared';

// We filter out falsy values because dynamic sources may not exist at every render.
// We flatten to support pipe operators from functional libraries like Ramda.
export function normalizeReshapeSources<TItem extends BaseItem>(
  sources: Array<AutocompleteReshapeSource<TItem>>
) {
  return flatten(sources).filter(Boolean);
}
