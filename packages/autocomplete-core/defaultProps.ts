import {
  generateAutocompleteId,
  getItemsCount,
  normalizeGetSources,
  noop,
} from './utils';

import { AutocompleteOptions, RequiredAutocompleteOptions } from './types';

export function getDefaultProps<TItem>(
  props: AutocompleteOptions<TItem>
): RequiredAutocompleteOptions<TItem> {
  const environment: typeof window = (typeof window !== 'undefined'
    ? window
    : {}) as typeof window;

  return {
    id: generateAutocompleteId(),
    minLength: 1,
    placeholder: '',
    autoFocus: false,
    defaultHighlightedIndex: 0,
    showCompletion: false,
    stallThreshold: 300,
    environment,
    shouldDropdownOpen: ({ state }) => getItemsCount(state) > 0,
    onStateChange: noop,
    onSubmit: noop,
    ...props,
    // The following props need to be deeply defaulted.
    initialState: {
      highlightedIndex: 0,
      query: '',
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
