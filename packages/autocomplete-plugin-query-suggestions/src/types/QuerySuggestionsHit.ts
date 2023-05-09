import { Hit } from '@algolia/client-search';

type QuerySuggestionsFacetValue = { value: string; count: number };

type QuerySuggestionsIndexMatch<TKey extends string> = Record<
  TKey,
  {
    exact_nb_hits: number;
    facets: {
      exact_matches: QuerySuggestionsFacetValue[];
    };
    analytics: QuerySuggestionsFacetValue[];
  }
>;

export type QuerySuggestionsHit<TIndexKey extends string = any> = Hit<{
  query: string;
  popularity: number;
  nb_words: number;
}> &
  QuerySuggestionsIndexMatch<TIndexKey>;

export type AutocompleteQuerySuggestionsHit<TIndexKey extends string = any> =
  QuerySuggestionsHit<TIndexKey> & {
    __autocomplete_qsCategory?: string;
  };
