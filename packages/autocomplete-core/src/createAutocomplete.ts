import { checkOptions } from './checkOptions';
import { createStore } from './createStore';
import { getAutocompleteSetters } from './getAutocompleteSetters';
import { getDefaultProps } from './getDefaultProps';
import { getPropGetters } from './getPropGetters';
import { onInput } from './onInput';
import { stateReducer } from './stateReducer';
import {
  AutocompleteApi,
  AutocompleteOptions,
  BaseItem,
  Subscribers,
} from './types';

export function createAutocomplete<
  TItem extends BaseItem,
  TEvent = Event,
  TMouseEvent = MouseEvent,
  TKeyboardEvent = KeyboardEvent
>(
  options: AutocompleteOptions<TItem>
): AutocompleteApi<TItem, TEvent, TMouseEvent, TKeyboardEvent> {
  checkOptions(options);

  const subscribers: Subscribers<TItem> = [];
  const props = getDefaultProps(options, subscribers);
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

  props.plugins.forEach((plugin) =>
    plugin.subscribe?.({
      setSelectedItemId,
      setQuery,
      setCollections,
      setIsOpen,
      setStatus,
      setContext,
      onSelect(fn) {
        subscribers.push({ onSelect: fn });
      },
      onHighlight(fn) {
        subscribers.push({ onHighlight: fn });
      },
    })
  );

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
