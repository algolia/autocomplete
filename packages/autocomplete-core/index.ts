import { getDefaultProps } from './defaultProps';
import { createStore } from './store';
import { getPropGetters } from './propGetters';
import { getAutocompleteSetters } from './autocompleteSetters';
import { getCompletion } from './completion';

import { PublicAutocompleteOptions, AutocompleteApi } from './types';

function createAutocomplete<TItem extends {}>(
  options: PublicAutocompleteOptions<TItem>
): AutocompleteApi<TItem> {
  const props = getDefaultProps(options);
  const store = createStore(props.initialState, props.onStateChange);

  const {
    setHighlightedIndex,
    setQuery,
    setSuggestions,
    setIsOpen,
    setStatus,
    setContext,
  } = getAutocompleteSetters({ store, props });
  const {
    getRootProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
  } = getPropGetters({
    store,
    props,
    setHighlightedIndex,
    setQuery,
    setSuggestions,
    setIsOpen,
    setStatus,
    setContext,
  });

  return {
    setHighlightedIndex,
    setQuery,
    setSuggestions,
    setIsOpen,
    setStatus,
    setContext,
    getRootProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getCompletion: () => getCompletion({ state: store.getState(), props }),
  };
}

export { createAutocomplete };
