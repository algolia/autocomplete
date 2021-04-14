import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

import { createRequester } from '../createRequester';

import {
  AlgoliaRequesterResponse,
  AlgoliaRequesterTransformedResponse,
} from './AlgoliaRequester';

export const createAlgoliaRequester = createRequester<
  typeof fetchAlgoliaResults,
  any,
  AlgoliaRequesterResponse<{}>,
  AlgoliaRequesterTransformedResponse<{}>
>(fetchAlgoliaResults);
