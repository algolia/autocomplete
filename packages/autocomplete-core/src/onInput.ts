import { invariant } from '@algolia/autocomplete-shared';

import { TransformedResponse, TransformResponse } from './createRequester';
import { resolve } from './resolve';
import {
  AutocompleteCollection,
  AutocompleteScopeApi,
  AutocompleteState,
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';
import { flatten, getActiveItem, isRequesterDescription } from './utils';

let lastStalledId: number | null = null;

interface OnInputParams<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  event: any;
  /**
   * The next partial state to apply after the function is called.
   *
   * This is useful when we call `onInput` in a different scenario than an
   * actual input. For example, we use `onInput` when we click on an item,
   * but we want to close the panel in that case.
   */
  nextState?: Partial<AutocompleteState<TItem>>;
  props: InternalAutocompleteOptions<TItem>;
  query: string;
  store: AutocompleteStore<TItem>;
}

export function onInput<TItem extends BaseItem>({
  event,
  nextState = {},
  props,
  query,
  refresh,
  store,
  ...setters
}: OnInputParams<TItem>): Promise<void> {
  if (lastStalledId) {
    props.environment.clearTimeout(lastStalledId);
  }

  const {
    setCollections,
    setIsOpen,
    setQuery,
    setActiveItemId,
    setStatus,
  } = setters;

  setQuery(query);
  setActiveItemId(props.defaultActiveItemId);

  if (!query && props.openOnFocus === false) {
    setStatus('idle');
    setCollections(
      store.getState().collections.map((collection) => ({
        ...collection,
        items: [],
      }))
    );
    setIsOpen(
      nextState.isOpen ?? props.shouldPanelOpen({ state: store.getState() })
    );

    return Promise.resolve();
  }

  setStatus('loading');

  lastStalledId = props.environment.setTimeout(() => {
    setStatus('stalled');
  }, props.stallThreshold);

  return props
    .getSources({
      query,
      refresh,
      state: store.getState(),
      ...setters,
    })
    .then((sources) => {
      setStatus('loading');

      return Promise.all(
        sources.map((source) => {
          return Promise.resolve(
            source.getItems({
              query,
              refresh,
              state: store.getState(),
              ...setters,
            })
          ).then((itemsOrDescription) => {
            if (isRequesterDescription(itemsOrDescription)) {
              return {
                ...itemsOrDescription,
                queries: itemsOrDescription.queries.map((query) => ({
                  query,
                  __autocomplete_sourceId: source.sourceId,
                  __autocomplete_transformResponse:
                    itemsOrDescription.transformResponse,
                })),
              };
            }

            return {
              items: itemsOrDescription,
              __autocomplete_sourceId: source.sourceId,
              __autocomplete_transformResponse: (x) => x.results,
            };
          });
        })
      )
        .then(resolve)
        .then((response) => {
          const flattenedResponse = flatten(response);

          return sources.map((source) => {
            const matches = flattenedResponse.filter((response) => {
              return response.__autocomplete_sourceId === source.sourceId;
            });

            const { __autocomplete_transformResponse } = matches[0];

            const results = matches.map(({ items }) => items);

            const items = __autocomplete_transformResponse({
              results,
              hits: results.map((result) => result.hits).filter(Boolean),
              facetHits: results
                .map((result) =>
                  result.facetHits?.map((facetHit) => {
                    return {
                      label: facetHit.value,
                      count: facetHit.count,
                      _highlightResult: {
                        label: {
                          value: facetHit.highlighted,
                        },
                      },
                    };
                  })
                )
                .filter(Boolean),
            });

            invariant(
              Array.isArray(items),
              `The \`getItems\` function must return an array of items but returned type ${JSON.stringify(
                typeof items
              )}:\n\n${JSON.stringify(items, null, 2)}`
            );

            return {
              source,
              items,
            };
          });
        })
        .then((collections) => {
          setStatus('idle');
          setCollections(collections as any);
          const isPanelOpen = props.shouldPanelOpen({
            state: store.getState(),
          });
          setIsOpen(
            nextState.isOpen ??
              ((props.openOnFocus && !query && isPanelOpen) || isPanelOpen)
          );

          const highlightedItem = getActiveItem(store.getState());

          if (store.getState().activeItemId !== null && highlightedItem) {
            const { item, itemInputValue, itemUrl, source } = highlightedItem;

            source.onActive({
              event,
              item,
              itemInputValue,
              itemUrl,
              refresh,
              source,
              state: store.getState(),
              ...setters,
            });
          }
        })
        .finally(() => {
          if (lastStalledId) {
            props.environment.clearTimeout(lastStalledId);
          }
        });
    });
}
