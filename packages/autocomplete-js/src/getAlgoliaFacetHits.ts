import {
  getAlgoliaFacetHits as getAlgoliaFacetHitsOriginal,
  SearchForFacetValuesParams,
} from '@algolia/autocomplete-preset-algolia';

import { version } from './version';

export function getAlgoliaFacetHits({
  searchClient,
  queries,
}: Pick<SearchForFacetValuesParams, 'searchClient' | 'queries'>) {
  return getAlgoliaFacetHitsOriginal({
    searchClient,
    queries,
    userAgents: [{ segment: 'autocomplete-js', version }],
  });
}
