import {
  getAlgoliaHits as getAlgoliaHitsOriginal,
  SearchParams,
} from '@algolia/autocomplete-preset-algolia';

import { version } from './version';

export function getAlgoliaHits<TRecord>({
  searchClient,
  queries,
}: SearchParams) {
  return getAlgoliaHitsOriginal<TRecord>({
    searchClient,
    queries,
    userAgents: [{ segment: 'autocomplete-js', version }],
  });
}
