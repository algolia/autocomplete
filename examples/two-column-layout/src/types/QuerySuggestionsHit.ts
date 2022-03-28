import { AutocompleteQuerySuggestionsHit } from '@algolia/autocomplete-plugin-query-suggestions/dist/esm/types';

import { AutocompleteHit } from './AutocompleteHit';

export type QuerySuggestionsHit = AutocompleteHit<AutocompleteQuerySuggestionsHit>;
