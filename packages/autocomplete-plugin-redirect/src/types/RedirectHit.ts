import { Hit } from '@algolia/client-search';

type RedirectFacetValue = { value: string; count: number };

type RedirectIndexMatch<TKey extends string> = Record<
  TKey,
  {
    exact_nb_hits: number;
    facets: {
      exact_matches: RedirectFacetValue[];
    };
    analytics: RedirectFacetValue[];
  }
>;

export type RedirectHit<TIndexKey extends string = any> = Hit<{
  query: string;
  popularity: number;
  nb_words: number;
}> &
  RedirectIndexMatch<TIndexKey>;

export type AutocompleteRedirectHit<
  TIndexKey extends string = any
> = RedirectHit<TIndexKey> & {
  __autocomplete_qsCategory?: string;
};
