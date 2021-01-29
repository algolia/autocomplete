import {
  getAlgoliaResults as getAlgoliaResultsOriginal,
  SearchParams,
} from '@algolia/autocomplete-preset-algolia';

import { version } from './version';

export function getAlgoliaResults<TRecord>({
  searchClient,
  queries,
}: Pick<SearchParams, 'searchClient' | 'queries'>) {
  return getAlgoliaResultsOriginal<TRecord>({
    searchClient,
    queries,
    userAgents: [{ segment: 'autocomplete-js', version }],
  });
}
