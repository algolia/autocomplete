import * as ClientSearch from '@algolia/client-search';
import type * as AlgoliaSearch from 'algoliasearch/lite';

// turns any to unknown, so it can be used as a conditional
// https://github.com/algolia/instantsearch/blob/18959b47f2f541f410e091a0cb7140f40e0956c2/packages/algoliasearch-helper/types/algoliasearch.d.ts#L14-L18
type AnyToUnknown<TSubject> = (
  0 extends 1 & TSubject ? true : false
) extends true
  ? unknown
  : TSubject;

type SearchClientShape = {
  search: unknown;
};

type ClientLiteV5 = AnyToUnknown<
  /** @ts-ignore */
  ReturnType<typeof AlgoliaSearch.liteClient>
>;
type ClientSearchV5 = AnyToUnknown<
  /** @ts-ignore */
  ReturnType<typeof ClientSearch.searchClient>
>;
type ClientV5 = ClientLiteV5 extends SearchClientShape
  ? ClientLiteV5
  : ClientSearchV5 extends SearchClientShape
  ? ClientSearchV5
  : unknown;

type PickForClient<TMapping extends { v4: unknown; v5: unknown }> =
  ClientV5 extends SearchClientShape ? TMapping['v5'] : TMapping['v4'];

export type SearchClient = PickForClient<{
  /** @ts-ignore */
  v4: AlgoliaSearch.SearchClient;
  /** @ts-ignore */
  v5: ClientV5;
}>;

export type MultipleQueriesQuery = PickForClient<{
  /** @ts-ignore */
  v4: ClientSearch.MultipleQueriesQuery;
  /** @ts-ignore */
  v5: AlgoliaSearch.LegacySearchMethodProps[number];
}>;

export type SearchForFacetValuesResponse = PickForClient<{
  /** @ts-ignore */
  v4: ClientSearch.SearchForFacetValuesResponse;
  /** @ts-ignore */
  v5: AlgoliaSearch.SearchForFacetValuesResponse;
}>;

export type SearchResponse<THit> = PickForClient<{
  /** @ts-ignore */
  v4: ClientSearch.SearchResponse<THit>;
  /** @ts-ignore */
  v5: AlgoliaSearch.SearchResponse<THit>;
}>;

export type HighlightResult<THit> = PickForClient<{
  /** @ts-ignore */
  v4: ClientSearch.HighlightResult<THit>;
  /** @ts-ignore */
  v5: AlgoliaSearch.HighlightResult; // should be generic, but isn't yet in the client
}>;

export type SnippetResult<THit> = PickForClient<{
  /** @ts-ignore */
  v4: ClientSearch.SnippetResult<THit>;
  /** @ts-ignore */
  v5: AlgoliaSearch.SnippetResult; // should be generic, but isn't yet in the client
}>;
