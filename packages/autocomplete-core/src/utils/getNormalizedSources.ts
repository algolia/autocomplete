import { MaybePromise } from '@algolia/autocomplete-shared';

import {
  AutocompleteSource,
  GetSourcesParams,
  InternalAutocompleteSource,
} from '../types';

import { createConcurrentSafePromise } from './createConcurrentSafePromise';
import { noop } from './noop';

const runConcurrentSafePromiseForGetSources = createConcurrentSafePromise<
  Array<AutocompleteSource<any>>
>();

export function getNormalizedSources<TItem>(
  getSources: (
    params: GetSourcesParams<TItem>
  ) => MaybePromise<Array<AutocompleteSource<TItem>>>,
  options: GetSourcesParams<TItem>
): Promise<Array<InternalAutocompleteSource<TItem>> | void> {
  return runConcurrentSafePromiseForGetSources(getSources(options)).then(
    (sources) => {
      return Promise.all(
        sources.filter(Boolean).map((source) => {
          const normalizedSource: InternalAutocompleteSource<TItem> = {
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

          return Promise.resolve(normalizedSource);
        })
      );
    }
  );
}
