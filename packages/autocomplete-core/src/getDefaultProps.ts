import {
  AutocompleteOptions,
  BaseItem,
  InternalAutocompleteOptions,
  AutocompleteSubscribers,
} from './types';
import {
  generateAutocompleteId,
  getItemsCount,
  getNormalizedSources,
  flatten,
} from './utils';

export function getDefaultProps<TItem extends BaseItem>(
  props: AutocompleteOptions<TItem>,
  subscribers: AutocompleteSubscribers<TItem>
): InternalAutocompleteOptions<TItem> {
  const environment: InternalAutocompleteOptions<TItem>['environment'] = (typeof window !==
  'undefined'
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
    onReset(params) {
      props.onReset?.(params);
      plugins.forEach((plugin) => {
        plugin.onReset?.(params);
      });
    },
    getSources(params) {
      return Promise.all(
        [...plugins.map((plugin) => plugin.getSources), props.getSources]
          .filter(Boolean)
          .map((getSources) => getNormalizedSources(getSources!, params))
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
      navigate({ itemUrl }) {
        environment.location.assign(itemUrl);
      },
      navigateNewTab({ itemUrl }) {
        const windowReference = environment.open(itemUrl, '_blank', 'noopener');

        if (windowReference) {
          windowReference.focus();
        }
      },
      navigateNewWindow({ itemUrl }) {
        environment.open(itemUrl, '_blank', 'noopener');
      },
      ...props.navigator,
    },
  };
}
