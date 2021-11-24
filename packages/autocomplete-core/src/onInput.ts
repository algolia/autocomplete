import { reshape } from './reshape';
import { preResolve, resolve, postResolve } from './resolve';
import {
  AutocompleteScopeApi,
  AutocompleteState,
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';
import { createConcurrentSafePromise, getActiveItem } from './utils';

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

let nextStateRef: Partial<AutocompleteState<any>> = {};
let propsRef = {} as InternalAutocompleteOptions<any>;
let queryRef = '';

export function onInput<TItem extends BaseItem>({
  event,
  nextState = {},
  props,
  query,
  refresh,
  store,
  ...setters
}: OnInputParams<TItem>): Promise<void> {
  nextStateRef = nextState;
  propsRef = props;
  queryRef = query;

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
    return runConcurrentSafePromise(collections).then(() => Promise.resolve());
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
  return runConcurrentSafePromise(
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
              preResolve<TItem>(itemsOrDescription, source.sourceId)
            );
          })
        )
          .then(resolve)
          .then((responses) => postResolve(responses, sources))
          .then((collections) =>
            reshape({ collections, props, state: store.getState() })
          );
      })
  )
    .then((collections) => {
      setStatus('idle');
      setCollections(collections as any);
      const isPanelOpen = propsRef.shouldPanelOpen({
        state: store.getState(),
      });
      setIsOpen(
        nextStateRef.isOpen ??
          ((propsRef.openOnFocus && !queryRef && isPanelOpen) || isPanelOpen)
      );

      if (nextStateRef.activeItemId !== undefined) {
        setActiveItemId(nextStateRef.activeItemId);
      }

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
        propsRef.environment.clearTimeout(lastStalledId);
      }
    });
}
