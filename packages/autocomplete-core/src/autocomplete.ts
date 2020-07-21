import { getDefaultProps } from './defaultProps';
import { onInput } from './onInput';
import { getPropGetters } from './propGetters';
import { getAutocompleteSetters } from './setters';
import { stateReducer } from './stateReducer';
import { createStore } from './store';
import { AutocompleteApi, PublicAutocompleteOptions } from './types';

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
