import type { SearchClient } from 'algoliasearch/lite';

import { Fetcher } from '../createFetcher';
import { WithTransformResponse } from '../createRequester';

export type RequesterDescription<TQuery, TResult> = WithTransformResponse<{
  fetcher: Fetcher<TQuery, TResult>;
  searchClient: SearchClient;
  queries: TQuery[];
}>;
