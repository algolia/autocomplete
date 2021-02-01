import { invariant } from '@algolia/autocomplete-shared';

import {
  AutocompleteScopeApi,
  AutocompleteState,
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';
import { getActiveItem } from './utils';

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
  if (props.onInput) {
    return Promise.resolve(
      props.onInput({
        query,
        refresh,
        state: store.getState(),
        ...setters,
      })
    );
  }

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
      nextState.isOpen ?? props.shouldPanelShow({ state: store.getState() })
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

      // @TODO: convert `Promise.all` to fetching strategy.
      return Promise.all(
        sources.map((source) => {
          return Promise.resolve(
            source.getItems({
              query,
              refresh,
              state: store.getState(),
              ...setters,
            })
          ).then((items) => {
            invariant(
              Array.isArray(items),
              `The \`getItems\` function must return an array of items but returned type ${JSON.stringify(
                typeof items
              )}:\n\n${JSON.stringify(items, null, 2)}`
            );

            return { source, items };
          });
        })
      )
        .then((collections) => {
          setStatus('idle');
          setCollections(collections as any);
          setIsOpen(
            nextState.isOpen ??
              ((!query && props.openOnFocus) ||
                props.shouldPanelShow({ state: store.getState() }))
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
