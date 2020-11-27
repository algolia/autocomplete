import { getNavigator } from './getNavigator';
import {
  AutocompleteOptions,
  BaseItem,
  InternalAutocompleteOptions,
  Subscribers,
} from './types';
import {
  generateAutocompleteId,
  getItemsCount,
  getNormalizedSources,
  flatten,
} from './utils';

export function getDefaultProps<TItem extends BaseItem>(
  props: AutocompleteOptions<TItem>,
  subscribers: Subscribers<TItem>
): InternalAutocompleteOptions<TItem> {
  const environment: InternalAutocompleteOptions<
    TItem
  >['environment'] = (typeof window !== 'undefined'
    ? window
    : {}) as typeof window;
  const plugins = props.plugins || [];

  return {
    debug: false,
    openOnFocus: false,
    placeholder: '',
    autoFocus: false,
    defaultSelectedItemId: null,
    stallThreshold: 300,
    environment,
    shouldPanelShow: ({ state }) => getItemsCount(state) > 0,
    ...props,
    // Since `generateAutocompleteId` triggers a side effect (it increments
    // and internal counter), we don't want to execute it if unnecessary.
    id: props.id ?? generateAutocompleteId(),
    // The following props need to be deeply defaulted.
    initialState: {
      selectedItemId: null,
      query: '',
      completion: null,
      collections: [],
      isOpen: false,
      status: 'idle',
      context: {},
      ...props.initialState,
    },
    plugins,
    onStateChange(params) {
      props.onStateChange?.(params);
      plugins.forEach((plugin) => {
        plugin.onStateChange?.(params);
      });
    },
    onSubmit(params) {
      props.onSubmit?.(params);
      plugins.forEach((plugin) => {
        plugin.onSubmit?.(params);
      });
    },
    getSources(options) {
      return Promise.all(
        [...plugins.map((plugin) => plugin.getSources), props.getSources]
          .filter(Boolean)
          .map((getSources) => getNormalizedSources(getSources!, options))
      )
        .then((nested) => flatten(nested))
        .then((sources) =>
          sources.map((source) => ({
            ...source,
            onSelect(params) {
              source.onSelect(params);
              subscribers.forEach((subscriber) => {
                subscriber.onSelect?.(params);
              });
            },
            onHighlight(params) {
              source.onHighlight(params);
              subscribers.forEach((subscriber) => {
                subscriber.onHighlight?.(params);
              });
            },
          }))
        );
    },
    navigator: {
      ...getNavigator({ environment }),
      ...props.navigator,
    },
  };
}
