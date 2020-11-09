import { MaybePromise } from '@algolia/autocomplete-shared';

import {
  AutocompleteSource,
  GetSourcesParams,
  InternalAutocompleteSource,
} from '../types';

import { noop } from './noop';

function normalizeSource<TItem>(
  source: AutocompleteSource<TItem>
): InternalAutocompleteSource<TItem> {
  return {
    getItemInputValue({ state }) {
      return state.query;
    },
    getItemUrl() {
      return undefined;
    },
    onSelect({ setIsOpen }) {
      setIsOpen(false);
    },
    onHighlight: noop,
    ...source,
  };
}

export function getNormalizedSources<TItem>(
  getSources: (
    params: GetSourcesParams<TItem>
  ) => MaybePromise<Array<AutocompleteSource<TItem>>>,
  options: GetSourcesParams<TItem>
): Promise<Array<InternalAutocompleteSource<TItem>>> {
  return Promise.resolve(getSources(options)).then((sources) =>
    Promise.all(
      sources.filter(Boolean).map((source) => {
        return Promise.resolve(normalizeSource<TItem>(source));
      })
    )
  );
}
