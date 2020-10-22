import {
  InternalAutocompleteOptions,
  AutocompleteSetters,
  AutocompleteState,
  AutocompleteStore,
  AutocompleteRefresh,
} from './types';
import { getHighlightedItem } from './utils';

let lastStalledId: number | null = null;

interface OnInputParams<TItem> extends AutocompleteSetters<TItem> {
  query: string;
  event: any;
  store: AutocompleteStore<TItem>;
  props: InternalAutocompleteOptions<TItem>;
  /**
   * The next partial state to apply after the function is called.
   *
   * This is useful when we call `onInput` in a different scenario than an
   * actual input. For example, we use `onInput` when we click on an item,
   * but we want to close the dropdown in that case.
   */
  nextState?: Partial<AutocompleteState<TItem>>;
  refresh: AutocompleteRefresh;
}

export function onInput<TItem>({
  query,
  event,
  store,
  props,
  setSelectedItemId,
  setQuery,
  setSuggestions,
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
        setSuggestions,
        setIsOpen,
        setStatus,
        setContext,
        refresh,
      })
    );
  }

  if (lastStalledId) {
    clearTimeout(lastStalledId);
  }

  setQuery(query);
  setSelectedItemId(props.defaultHighlightedIndex);

  if (query.length === 0 && props.openOnFocus === false) {
    setStatus('idle');
    setSuggestions(
      store.getState().suggestions.map((suggestion) => ({
        ...suggestion,
        items: [],
      }))
    );
    setIsOpen(
      nextState.isOpen ?? props.shouldDropdownShow({ state: store.getState() })
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
      setSuggestions,
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
            source.getSuggestions({
              query,
              state: store.getState(),
              setSelectedItemId,
              setQuery,
              setSuggestions,
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
        .then((suggestions) => {
          setStatus('idle');
          setSuggestions(suggestions as any);
          setIsOpen(
            nextState.isOpen ??
              ((query.length === 0 && props.openOnFocus) ||
                props.shouldDropdownShow({ state: store.getState() }))
          );

          const highlightedItem = getHighlightedItem({
            state: store.getState(),
          });

          if (store.getState().highlightedIndex !== null && highlightedItem) {
            const { item, itemValue, itemUrl, source } = highlightedItem;

            source.onHighlight({
              suggestion: item,
              suggestionValue: itemValue,
              suggestionUrl: itemUrl,
              source,
              state: store.getState(),
              setSelectedItemId,
              setQuery,
              setSuggestions,
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
            clearTimeout(lastStalledId);
          }
        });
    });
}
