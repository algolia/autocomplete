import { stateReducer } from './stateReducer';
import { getDefaultProps } from './defaultProps';
import { createStore } from './store';
import { getPropGetters } from './propGetters';
import { getAutocompleteSetters } from './setters';

import { PublicAutocompleteOptions, AutocompleteApi } from './types';
import { onInput } from './onInput';

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
    getLabelProps,
    getInputProps,
    getDropdownProps,
    getMenuProps,
    getItemProps,
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

  function refresh() {
    return onInput({
      query: store.getState().query,
      store,
      props,
      setHighlightedIndex,
      setQuery,
      setSuggestions,
      setIsOpen,
      setStatus,
      setContext,
    });
  }

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
    getLabelProps,
    getDropdownProps,
    getMenuProps,
    getItemProps,
    refresh,
  };
}

export { createAutocomplete };
