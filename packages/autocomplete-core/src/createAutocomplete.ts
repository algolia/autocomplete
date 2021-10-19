import { checkOptions } from './checkOptions';
import { createStore } from './createStore';
import { getAutocompleteSetters } from './getAutocompleteSetters';
import { getDefaultProps } from './getDefaultProps';
import { getPropGetters } from './getPropGetters';
import { getMetadata, injectMetadata } from './metadata';
import { onInput } from './onInput';
import { stateReducer } from './stateReducer';
import {
  AutocompleteApi,
  AutocompleteOptions as AutocompleteCoreOptions,
  BaseItem,
  AutocompleteSubscribers,
} from './types';

export interface AutocompleteOptionsWithMetadata<TItem extends BaseItem>
  extends AutocompleteCoreOptions<TItem> {
  /**
   * @internal
   */
  __autocomplete_metadata?: Record<string, unknown>;
}

export function createAutocomplete<
  TItem extends BaseItem,
  TEvent = Event,
  TMouseEvent = MouseEvent,
  TKeyboardEvent = KeyboardEvent
>(
  options: AutocompleteOptionsWithMetadata<TItem>
): AutocompleteApi<TItem, TEvent, TMouseEvent, TKeyboardEvent> {
  checkOptions(options);

  const subscribers: AutocompleteSubscribers<TItem> = [];
  const props = getDefaultProps(options, subscribers);
  const store = createStore(stateReducer, props, onStoreStateChange);

  const setters = getAutocompleteSetters({ store });
  const propGetters = getPropGetters<
    TItem,
    TEvent,
    TMouseEvent,
    TKeyboardEvent
  >({ props, refresh, store, ...setters });

  function onStoreStateChange({ prevState, state }) {
    props.onStateChange({ prevState, state, refresh, ...setters });
  }

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
      refresh,
      onSelect(fn) {
        subscribers.push({ onSelect: fn });
      },
      onActive(fn) {
        subscribers.push({ onActive: fn });
      },
    })
  );

  injectMetadata({
    metadata: getMetadata({ plugins: props.plugins, options }),
    environment: props.environment,
  });

  return {
    refresh,
    ...propGetters,
    ...setters,
  };
}
