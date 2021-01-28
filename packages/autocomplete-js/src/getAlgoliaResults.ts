import {
  getAlgoliaResults as getAlgoliaResultsOriginal,
  SearchParams,
} from '@algolia/autocomplete-preset-algolia';

import { version } from './version';

export function getAlgoliaResults<TRecord>({
  searchClient,
  queries,
}: SearchParams) {
  return getAlgoliaResultsOriginal<TRecord>({
    searchClient,
    queries,
    userAgents: [{ segment: 'autocomplete-js', version }],
  });
}
