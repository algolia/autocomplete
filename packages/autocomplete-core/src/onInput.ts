import {
  AutocompleteOptions,
  AutocompleteSetters,
  AutocompleteStore,
  AutocompleteState,
} from './types';

let lastStalledId: number | null = null;

interface OnInputParams<TItem> extends AutocompleteSetters<TItem> {
  query: string;
  store: AutocompleteStore<TItem>;
  props: AutocompleteOptions<TItem>;
  /**
   * The next partial state to apply after the function is called.
   *
   * This is useful when we call `onInput` in a different scenario than an
   * actual input. For example, we use `onInput` when we click on an item,
   * but we want to close the dropdown in that case.
   */
  nextState?: Partial<AutocompleteState<TItem>>;
}

export function onInput<TItem>({
  query,
  store,
  props,
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
  nextState = {},
}: OnInputParams<TItem>): Promise<void> {
  if (props.onInput) {
    return Promise.resolve(
      props.onInput({
        query,
        state: store.getState(),
        setHighlightedIndex,
        setQuery,
        setSuggestions,
        setIsOpen,
        setStatus,
        setContext,
      })
    );
  }

  if (lastStalledId) {
    clearTimeout(lastStalledId);
  }

  setHighlightedIndex(props.defaultHighlightedIndex);
  setQuery(query);

  if (query.length === 0 && props.openOnFocus === false) {
    setStatus('idle');
    setSuggestions(
      store.getState().suggestions.map(suggestion => ({
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
      setHighlightedIndex,
      setQuery,
      setSuggestions,
      setIsOpen,
      setStatus,
      setContext,
    })
    .then(sources => {
      setStatus('loading');

      // @TODO: convert `Promise.all` to fetching strategy.
      return Promise.all(
        sources.map(source => {
          return Promise.resolve(
            source.getSuggestions({
              query,
              state: store.getState(),
              setHighlightedIndex,
              setQuery,
              setSuggestions,
              setIsOpen,
              setStatus,
              setContext,
            })
          ).then(items => {
            return {
              source,
              items,
            };
          });
        })
      )
        .then(suggestions => {
          setStatus('idle');
          setSuggestions(suggestions as any);
          setIsOpen(
            nextState.isOpen ??
              ((query.length === 0 && props.openOnFocus) ||
                props.shouldDropdownShow({ state: store.getState() }))
          );
        })
        .catch(error => {
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
