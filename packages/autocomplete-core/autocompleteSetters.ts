import { stateReducer } from './stateReducer';

import { AutocompleteInstance, AutocompleteItem } from './types';

export function getAutocompleteSetters<TItem extends AutocompleteItem>({
  store,
  props,
}) {
  const setHighlightedIndex: AutocompleteInstance<
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

  const setQuery: AutocompleteInstance<TItem>['setQuery'] = value => {
    store.setState(
      stateReducer(store.getState(), { type: 'setQuery', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  const setSuggestions: AutocompleteInstance<
    any
  >['setSuggestions'] = rawValue => {
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

  const setIsOpen: AutocompleteInstance<TItem>['setIsOpen'] = value => {
    store.setState(
      stateReducer(store.getState(), { type: 'setIsOpen', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  const setStatus: AutocompleteInstance<TItem>['setStatus'] = value => {
    store.setState(
      stateReducer(store.getState(), { type: 'setStatus', value }, props)
    );
    props.onStateChange({ state: store.getState() });
  };

  const setContext: AutocompleteInstance<TItem>['setContext'] = value => {
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
