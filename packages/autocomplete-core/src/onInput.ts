import {
  AutocompleteSetters,
  AutocompleteState,
  AutocompleteStore,
  AutocompleteRefresh,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';
import { getSelectedItem } from './utils';

let lastStalledId: number | null = null;

interface OnInputParams<TItem extends BaseItem>
  extends AutocompleteSetters<TItem> {
  query: string;
  event: any;
  store: AutocompleteStore<TItem>;
  props: InternalAutocompleteOptions<TItem>;
  /**
   * The next partial state to apply after the function is called.
   *
   * This is useful when we call `onInput` in a different scenario than an
   * actual input. For example, we use `onInput` when we click on an item,
   * but we want to close the panel in that case.
   */
  nextState?: Partial<AutocompleteState<TItem>>;
  refresh: AutocompleteRefresh;
}

export function onInput<TItem extends BaseItem>({
  query,
  event,
  store,
  props,
  setSelectedItemId,
  setQuery,
  setCollections,
  setIsOpen,
  setStatus,
  setContext,
  nextState = {},
  refresh,
}: OnInputParams<TItem>): Promise<void> {
  if (props.onInput) {
    return Promise.resolve(
      props.onInput({
        query,
        state: store.getState(),
        setSelectedItemId,
        setQuery,
        setCollections,
        setIsOpen,
        setStatus,
        setContext,
        refresh,
      })
    );
  }

  if (lastStalledId) {
    props.environment.clearTimeout(lastStalledId);
  }

  setQuery(query);
  setSelectedItemId(props.defaultSelectedItemId);

  if (query.length === 0 && props.openOnFocus === false) {
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
      state: store.getState(),
      setSelectedItemId,
      setQuery,
      setCollections,
      setIsOpen,
      setStatus,
      setContext,
      refresh,
    })
    .then((sources) => {
      setStatus('loading');

      // @TODO: convert `Promise.all` to fetching strategy.
      return Promise.all(
        sources.map((source) => {
          return Promise.resolve(
            source.getItems({
              query,
              state: store.getState(),
              setSelectedItemId,
              setQuery,
              setCollections,
              setIsOpen,
              setStatus,
              setContext,
              refresh,
            })
          ).then((items) => {
            return {
              source,
              items,
            };
          });
        })
      )
        .then((collections) => {
          setStatus('idle');
          setCollections(collections as any);
          setIsOpen(
            nextState.isOpen ??
              ((query.length === 0 && props.openOnFocus) ||
                props.shouldPanelShow({ state: store.getState() }))
          );

          const highlightedItem = getSelectedItem({
            state: store.getState(),
          });

          if (store.getState().selectedItemId !== null && highlightedItem) {
            const { item, itemInputValue, itemUrl, source } = highlightedItem;

            source.onHighlight({
              item,
              itemInputValue,
              itemUrl,
              source,
              state: store.getState(),
              setSelectedItemId,
              setQuery,
              setCollections,
              setIsOpen,
              setStatus,
              setContext,
              event,
            });
          }
        })
        .catch((error) => {
          setStatus('error');

          throw error;
        })
        .finally(() => {
          if (lastStalledId) {
            props.environment.clearTimeout(lastStalledId);
          }
        });
    });
}
