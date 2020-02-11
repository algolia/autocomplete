import { stateReducer } from './stateReducer';

import {
  AutocompleteApi,
  AutocompleteStore,
  AutocompleteOptions,
} from './types';

interface GetAutocompleteSettersOptions<TItem> {
  store: AutocompleteStore<TItem>;
  props: AutocompleteOptions<TItem>;
}

export function getAutocompleteSetters<TItem>({
  store,
  props,
}: GetAutocompleteSettersOptions<TItem>) {
  const setHighlightedIndex: AutocompleteApi<
    TItem
  >['setHighlightedIndex'] = value => {
    store.setState(
      stateReducer(
        store.getState(),
        { type: 'setHighlightedIndex', value },
        props
      )
    );
    props.onStateChange({ state: store.getState() });
  };

  const setQuery: AutocompleteApi<TItem>['setQuery'] = value => {
    store.setState(
      stateReducer(store.getState(), { type: 'setQuery', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  const setSuggestions: AutocompleteApi<TItem>['setSuggestions'] = rawValue => {
    let baseItemId = 0;
    const value = rawValue.map(suggestion => ({
      ...suggestion,
      items: suggestion.items.map(item => ({
        ...item,
        __autocomplete_id: baseItemId++,
      })),
    }));

    store.setState(
      stateReducer(store.getState(), { type: 'setSuggestions', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  const setIsOpen: AutocompleteApi<TItem>['setIsOpen'] = value => {
    store.setState(
      stateReducer(store.getState(), { type: 'setIsOpen', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  const setStatus: AutocompleteApi<TItem>['setStatus'] = value => {
    store.setState(
      stateReducer(store.getState(), { type: 'setStatus', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  const setContext: AutocompleteApi<TItem>['setContext'] = value => {
    store.setState(
      stateReducer(store.getState(), { type: 'setContext', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  return {
    setHighlightedIndex,
    setQuery,
    setSuggestions,
    setIsOpen,
    setStatus,
    setContext,
  };
}
