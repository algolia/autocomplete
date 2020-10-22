import { InternalAutocompleteOptions, AutocompleteOptions } from './types';
import {
  generateAutocompleteId,
  getItemsCount,
  noop,
  getNormalizedSources,
} from './utils';

export function getDefaultProps<TItem>(
  props: AutocompleteOptions<TItem>
): InternalAutocompleteOptions<TItem> {
  const environment: typeof window = (typeof window !== 'undefined'
    ? window
    : {}) as typeof window;
  const plugins = props.plugins || [];

  return {
    debug: false,
    openOnFocus: false,
    placeholder: '',
    autoFocus: false,
    defaultSelectedItemId: null,
    enableCompletion: false,
    stallThreshold: 300,
    environment,
    shouldDropdownShow: ({ state }) => getItemsCount(state) > 0,
    onStateChange: noop,
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
      statusContext: {},
      context: {},
      ...props.initialState,
    },
    onSubmit: (params) => {
      if (props.onSubmit) {
        props.onSubmit(params);
      }
      plugins.forEach((plugin) => {
        if (plugin.onSubmit) {
          plugin.onSubmit(params);
        }
      });
    },
    getSources: (options) => {
      const getSourcesFromPlugins = plugins
        .map((plugin) => plugin.getSources)
        .filter((getSources) => getSources !== undefined);

      return Promise.all(
        [...getSourcesFromPlugins, props.getSources].map((getSources) =>
          getNormalizedSources(getSources!, options)
        )
      )
        .then((nested) =>
          // same as `nested.flat()`
          nested.reduce((acc, array) => {
            acc = acc.concat(array);
            return acc;
          }, [])
        )
        .then((sources) =>
          sources.map((source) => ({
            ...source,
            onSelect: (params) => {
              source.onSelect(params);
              plugins.forEach((plugin) => {
                if (plugin.onSelect) {
                  plugin.onSelect(params);
                }
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
    plugins,
  };
}
