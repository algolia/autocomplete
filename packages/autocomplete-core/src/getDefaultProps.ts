import { AutocompleteOptions, PublicAutocompleteOptions } from './types';
import {
  generateAutocompleteId,
  getItemsCount,
  noop,
  getNormalizedSources,
} from './utils';

export function getDefaultProps<TItem>(
  props: PublicAutocompleteOptions<TItem>
): AutocompleteOptions<TItem> {
  const environment: typeof window = (typeof window !== 'undefined'
    ? window
    : {}) as typeof window;

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
    onSubmit: noop,
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
    getSources: (options) => {
      const getSourcesFromPlugins = (props.plugins || [])
        .map((plugin) => plugin.getSources)
        .filter((getSources) => getSources !== undefined);

      return Promise.all(
        [...getSourcesFromPlugins, props.getSources].map((getSources) =>
          getNormalizedSources(getSources!, options)
        )
      ).then((nested) =>
        // same as `nested.flat()`
        nested.reduce((acc, array) => {
          acc = acc.concat(array);
          return acc;
        }, [])
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
  };
}
