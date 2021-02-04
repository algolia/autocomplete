import { invariant } from '@algolia/autocomplete-shared';

import {
  AutocompleteSource,
  BaseItem,
  GetSources,
  GetSourcesParams,
  InternalAutocompleteSource,
  InternalGetSources,
} from '../types';

import { noop } from './noop';

export function getNormalizedSources<TItem extends BaseItem>(
  getSources: GetSources<TItem>,
  params: GetSourcesParams<TItem>
): ReturnType<InternalGetSources<TItem>> {
  return Promise.resolve(getSources(params)).then((sources) => {
    invariant(
      Array.isArray(sources),
      `The \`getSources\` function must return an array of sources but returned type ${JSON.stringify(
        typeof sources
      )}:\n\n${JSON.stringify(sources, null, 2)}`
    );

    return Promise.all(
      sources
        // We allow `undefined` and `false` sources to allow users to use
        // `Boolean(query) && source` (=> `false`).
        // We need to remove these values at this point.
        .filter((maybeSource: any): maybeSource is AutocompleteSource<TItem> =>
          Boolean(maybeSource)
        )
        .map((source) => {
          invariant(
            source.sourceId !== undefined,
            `The \`getSources\` function must return a \`sourceId\` string but returned type ${JSON.stringify(
              typeof source.sourceId
            )}:\n\n${JSON.stringify(source.sourceId, null, 2)}`
          );

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
            onActive: noop,
            ...source,
          };

          return Promise.resolve(normalizedSource);
        })
    );
  });
}
