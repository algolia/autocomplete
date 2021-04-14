import {
  AlgoliaRequesterResponse,
  AlgoliaRequesterTransformedResponse,
  createRequester,
} from '@algolia/autocomplete-core';
import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

import { version } from '../version';

export const createAlgoliaRequester = createRequester<
  typeof fetchAlgoliaResults,
  any,
  AlgoliaRequesterResponse<{}>,
  AlgoliaRequesterTransformedResponse<{}>
>((params) =>
  fetchAlgoliaResults({
    ...params,
    userAgents: [{ segment: 'autocomplete-js', version }],
  })
);
