import { createRequester } from '../createRequester';
import { fetchAlgoliaResults } from '../fetchers';

import {
  AlgoliaRequesterParams,
  AlgoliaRequesterQuery,
  AlgoliaRequesterResponse,
  AlgoliaRequesterTransformedResponse,
} from './getAlgoliaResults';

export const getAlgoliaFacets = createRequester<
  typeof fetchAlgoliaResults,
  AlgoliaRequesterParams,
  AlgoliaRequesterQuery,
  AlgoliaRequesterResponse<{}>,
  AlgoliaRequesterTransformedResponse<{}>
>({
  fetcher: fetchAlgoliaResults,
  transformResponse: ({ facetHits }) => facetHits,
});
