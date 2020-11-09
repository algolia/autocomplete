import { Hit } from '@algolia/client-search';

export type QuerySuggestionsHit = Hit<{
  query: string;
  popularity: number;
  nb_words: number;
}>;
