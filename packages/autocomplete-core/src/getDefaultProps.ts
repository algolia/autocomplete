import { InternalAutocompleteOptions, AutocompleteOptions } from './types';
import {
  generateAutocompleteId,
  getItemsCount,
  noop,
  normalizeGetSources,
} from './utils';

export function getDefaultProps<TItem>(
  props: AutocompleteOptions<TItem>
): InternalAutocompleteOptions<TItem> {
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
    getSources: normalizeGetSources(props.getSources),
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
