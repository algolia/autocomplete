import { invariant, decycle, noop } from '@algolia/autocomplete-shared';

import {
  AutocompleteSource,
  BaseItem,
  GetSources,
  GetSourcesParams,
  InternalAutocompleteSource,
  InternalGetSources,
} from '../types';

export function getNormalizedSources<TItem extends BaseItem>(
  getSources: GetSources<TItem>,
  params: GetSourcesParams<TItem>
): ReturnType<InternalGetSources<TItem>> {
  const seenSourceIds: string[] = [];

  return Promise.resolve(getSources(params)).then((sources) => {
    invariant(
      Array.isArray(sources),
      () =>
        `The \`getSources\` function must return an array of sources but returned type ${JSON.stringify(
          typeof sources
        )}:\n\n${JSON.stringify(decycle(sources), null, 2)}`
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
            typeof source.sourceId === 'string',
            'A source must provide a `sourceId` string.'
          );

          if (seenSourceIds.includes(source.sourceId)) {
            throw new Error(
              `[Autocomplete] The \`sourceId\` ${JSON.stringify(
                source.sourceId
              )} is not unique.`
            );
          }

          seenSourceIds.push(source.sourceId);

          const defaultSource: Omit<
            InternalAutocompleteSource<TItem>,
            'sourceId' | 'getItems'
          > = {
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
            onResolve: noop,
          };

          Object.keys(defaultSource).forEach((key) => {
            defaultSource[key].__default = true;
          });

          const normalizedSource: InternalAutocompleteSource<TItem> = {
            ...defaultSource,
            ...source,
          };

          return Promise.resolve(normalizedSource);
        })
    );
  });
}
