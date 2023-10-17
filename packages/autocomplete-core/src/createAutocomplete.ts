import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';

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
  >({ props, refresh, store, navigator: props.navigator, ...setters });

  function onStoreStateChange({ prevState, state }) {
    props.onStateChange({
      prevState,
      state,
      refresh,
      navigator: props.navigator,
      ...setters,
    });

    if (
      !isAlgoliaInsightsPluginEnabled() &&
      state.context?.algoliaInsightsPlugin?.__automaticInsights &&
      props.insights !== false
    ) {
      const plugin = createAlgoliaInsightsPlugin({
        __autocomplete_clickAnalytics: false,
      });

      props.plugins.push(plugin);

      subscribePlugins([plugin]);
    }
  }

  function refresh() {
    return onInput({
      event: new Event('input'),
      nextState: { isOpen: store.getState().isOpen },
      props,
      navigator: props.navigator,
      query: store.getState().query,
      refresh,
      store,
      ...setters,
    });
  }

  function subscribePlugins(plugins: typeof props.plugins) {
    plugins.forEach((plugin) =>
      plugin.subscribe?.({
        ...setters,
        navigator: props.navigator,
        refresh,
        onSelect(fn) {
          subscribers.push({ onSelect: fn });
        },
        onActive(fn) {
          subscribers.push({ onActive: fn });
        },
        onResolve(fn) {
          subscribers.push({ onResolve: fn });
        },
      })
    );
  }

  function isAlgoliaInsightsPluginEnabled() {
    return props.plugins.some(
      (plugin) => plugin.name === 'aa.algoliaInsightsPlugin'
    );
  }

  if (props.insights && !isAlgoliaInsightsPluginEnabled()) {
    const insightsParams =
      typeof props.insights === 'boolean' ? {} : props.insights;
    props.plugins.push(createAlgoliaInsightsPlugin(insightsParams));
  }

  subscribePlugins(props.plugins);

  injectMetadata({
    metadata: getMetadata({ plugins: props.plugins, options }),
    environment: props.environment,
  });

  return {
    refresh,
    navigator: props.navigator,
    ...propGetters,
    ...setters,
  };
}
