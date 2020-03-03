import { stateReducer } from './stateReducer';
import { getDefaultProps } from './defaultProps';
import { createStore } from './store';
import { getPropGetters } from './propGetters';
import { getAutocompleteSetters } from './setters';

import { PublicAutocompleteOptions, AutocompleteApi } from './types';

function createAutocomplete<
  TItem extends {},
  TEvent = Event,
  TMouseEvent = MouseEvent,
  TKeyboardEvent = KeyboardEvent
>(
  options: PublicAutocompleteOptions<TItem>
): AutocompleteApi<TItem, TEvent, TMouseEvent, TKeyboardEvent> {
  const props = getDefaultProps(options);
  const store = createStore(stateReducer, props);

  const {
    setHighlightedIndex,
    setQuery,
    setSuggestions,
    setIsOpen,
    setStatus,
    setContext,
  } = getAutocompleteSetters({ store });
  const {
    getEnvironmentProps,
    getRootProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
  } = getPropGetters<TItem, TEvent, TMouseEvent, TKeyboardEvent>({
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
    getEnvironmentProps,
    getRootProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
  };
}

export { createAutocomplete };
