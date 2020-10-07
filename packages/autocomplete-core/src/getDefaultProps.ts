import { InternalAutocompleteOptions, AutocompleteOptions } from './types';
import {
  generateAutocompleteId,
  getItemsCount,
  noop,
  getNormalizedSources,
  flatten,
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
    defaultHighlightedIndex: null,
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
      highlightedIndex: null,
      query: '',
      completion: null,
      suggestions: [],
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
          flatten(nested)
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
      navigate({ suggestionUrl }) {
        environment.location.assign(suggestionUrl);
      },
      navigateNewTab({ suggestionUrl }) {
        const windowReference = environment.open(
          suggestionUrl,
          '_blank',
          'noopener'
        );

        if (windowReference) {
          windowReference.focus();
        }
      },
      navigateNewWindow({ suggestionUrl }) {
        environment.open(suggestionUrl, '_blank', 'noopener');
      },
      ...props.navigator,
    },
    plugins,
  };
}
