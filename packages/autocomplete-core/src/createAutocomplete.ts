import { checkOptions } from './checkOptions';
import { createStore } from './createStore';
import { getAutocompleteSetters } from './getAutocompleteSetters';
import { getDefaultProps } from './getDefaultProps';
import { getPropGetters } from './getPropGetters';
import { onInput } from './onInput';
import { stateReducer } from './stateReducer';
import { AutocompleteApi, AutocompleteOptions, BaseItem } from './types';

export function createAutocomplete<
  TItem extends BaseItem,
  TEvent = Event,
  TMouseEvent = MouseEvent,
  TKeyboardEvent = KeyboardEvent
>(
  options: AutocompleteOptions<TItem>
): AutocompleteApi<TItem, TEvent, TMouseEvent, TKeyboardEvent> {
  checkOptions(options);

  const props = getDefaultProps(options);
  const store = createStore(stateReducer, props);

  const {
    setSelectedItemId,
    setQuery,
    setCollections,
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
    getPanelProps,
    getListProps,
    getItemProps,
  } = getPropGetters<TItem, TEvent, TMouseEvent, TKeyboardEvent>({
    store,
    props,
    setSelectedItemId,
    setQuery,
    setCollections,
    setIsOpen,
    setStatus,
    setContext,
    refresh,
  });

  function refresh() {
    return onInput({
      query: store.getState().query,
      event: new Event('input'),
      store,
      props,
      setSelectedItemId,
      setQuery,
      setCollections,
      setIsOpen,
      setStatus,
      setContext,
      nextState: {
        isOpen: store.getState().isOpen,
      },
      refresh,
    });
  }

  return {
    setSelectedItemId,
    setQuery,
    setCollections,
    setIsOpen,
    setStatus,
    setContext,
    getEnvironmentProps,
    getRootProps,
    getFormProps,
    getInputProps,
    getLabelProps,
    getPanelProps,
    getListProps,
    getItemProps,
    refresh,
  };
}
