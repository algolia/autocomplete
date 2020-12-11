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
  AutocompleteSubscribers,
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

  const subscribers: AutocompleteSubscribers<TItem> = [];
  const props = getDefaultProps(options, subscribers);
  const store = createStore(stateReducer, props);

  const setters = getAutocompleteSetters({ store });
  const propGetters = getPropGetters<
    TItem,
    TEvent,
    TMouseEvent,
    TKeyboardEvent
  >({ props, refresh, store, ...setters });

  function refresh() {
    return onInput({
      event: new Event('input'),
      nextState: { isOpen: store.getState().isOpen },
      props,
      query: store.getState().query,
      refresh,
      store,
      ...setters,
    });
  }

  props.plugins.forEach((plugin) =>
    plugin.subscribe?.({
      ...setters,
      onSelect(fn) {
        subscribers.push({ onSelect: fn });
      },
      onHighlight(fn) {
        subscribers.push({ onHighlight: fn });
      },
    })
  );

  return {
    refresh,
    ...propGetters,
    ...setters,
  };
}
