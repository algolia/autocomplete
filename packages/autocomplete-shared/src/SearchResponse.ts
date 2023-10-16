import type { SearchResponse as ClientSearchResponse } from '@algolia/client-search';

export type SearchResponse<TObject> = ClientSearchResponse<TObject> & {
  _automaticInsights?: true;
};
