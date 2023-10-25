import { SearchResponse } from '@algolia/autocomplete-shared';
import { SearchForFacetValuesResponse } from '@algolia/client-search';

import { reshape } from './reshape';
import { preResolve, resolve, postResolve } from './resolve';
import {
  AutocompleteScopeApi,
  AutocompleteState,
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';
import {
  cancelable,
  CancelablePromise,
  createConcurrentSafePromise,
  getActiveItem,
} from './utils';

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

const runConcurrentSafePromise = createConcurrentSafePromise();

export function onInput<TItem extends BaseItem>({
  event,
  nextState = {},
  props,
  query,
  refresh,
  store,
  ...setters
}: OnInputParams<TItem>): CancelablePromise<void> {
  if (lastStalledId) {
    props.environment.clearTimeout(lastStalledId);
  }

  const {
    setCollections,
    setIsOpen,
    setQuery,
    setActiveItemId,
    setStatus,
    setContext,
  } = setters;

  setQuery(query);
  setActiveItemId(props.defaultActiveItemId);

  if (!query && props.openOnFocus === false) {
    const collections = store.getState().collections.map((collection) => ({
      ...collection,
      items: [],
    }));

    setStatus('idle');
    setCollections(collections);
    setIsOpen(
      nextState.isOpen ?? props.shouldPanelOpen({ state: store.getState() })
    );

    // We make sure to update the latest resolved value of the tracked
    // promises to keep late resolving promises from "cancelling" the state
    // updates performed in this code path.
    // We chain with a void promise to respect `onInput`'s expected return type.
    const request = cancelable(
      runConcurrentSafePromise(collections).then(() => Promise.resolve())
    );

    return store.pendingRequests.add(request);
  }

  setStatus('loading');

  lastStalledId = props.environment.setTimeout(() => {
    setStatus('stalled');
  }, props.stallThreshold);

  // We track the entire promise chain triggered by `onInput` before mutating
  // the Autocomplete state to make sure that any state manipulation is based on
  // fresh data regardless of when promises individually resolve.
  // We don't track nested promises and only rely on the full chain resolution,
  // meaning we should only ever manipulate the state once this concurrent-safe
  // promise is resolved.
  const request = cancelable(
    runConcurrentSafePromise(
      props
        .getSources({
          query,
          refresh,
          state: store.getState(),
          ...setters,
        })
        .then((sources) => {
          return Promise.all(
            sources.map((source) => {
              return Promise.resolve(
                source.getItems({
                  query,
                  refresh,
                  state: store.getState(),
                  ...setters,
                })
              ).then((itemsOrDescription) =>
                preResolve<TItem>(
                  itemsOrDescription,
                  source.sourceId,
                  store.getState()
                )
              );
            })
          )
            .then(resolve)
            .then((responses) => {
              const __automaticInsights = responses.some(({ items }) =>
                isSearchResponseWithAutomaticInsightsFlag<TItem>(items)
              );

              // No need to pollute the context if `__automaticInsights=false`
              if (__automaticInsights) {
                setContext({
                  algoliaInsightsPlugin: {
                    ...((store.getState().context?.algoliaInsightsPlugin ||
                      {}) as Record<string, unknown>),
                    __automaticInsights,
                  },
                });
              }

              return postResolve(responses, sources, store);
            })
            .then((collections) =>
              reshape({ collections, props, state: store.getState() })
            );
        })
    )
  )
    .then((collections) => {
      // Parameters passed to `onInput` could be stale when the following code
      // executes, because `onInput` calls may not resolve in order.
      // If it becomes a problem we'll need to save the last passed parameters.
      // See: https://codesandbox.io/s/agitated-cookies-y290z

      setStatus('idle');

      setCollections(collections as any);

      const isPanelOpen = props.shouldPanelOpen({ state: store.getState() });

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
      setStatus('idle');

      if (lastStalledId) {
        props.environment.clearTimeout(lastStalledId);
      }
    });

  return store.pendingRequests.add(request);
}

function isSearchResponseWithAutomaticInsightsFlag<TItem>(
  items:
    | TItem[]
    | TItem[][]
    | SearchForFacetValuesResponse
    | SearchResponse<TItem>
): items is SearchResponse<TItem> {
  return (
    !Array.isArray(items) &&
    Boolean((items as SearchResponse<TItem>)?._automaticInsights)
  );
}
