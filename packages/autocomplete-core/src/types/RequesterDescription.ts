import type { SearchClient } from 'algoliasearch/lite';

import { Fetcher } from '../createFetcher';
import { TransformedResponse } from '../createRequester';

export type RequesterDescription<TQuery, TResponse> = {
  fetcher: Fetcher<TQuery, TResponse, any, any>;
  searchClient: SearchClient;
  queries: TQuery[];
  transformResponse: TransformedResponse<any, any, any>;
};
