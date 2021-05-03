import type {
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';

export function mapToAlgoliaResponse<THit>(
  rawResults: Array<SearchResponse<THit> | SearchForFacetValuesResponse>
) {
  const results: Array<
    SearchResponse<THit> | SearchForFacetValuesResponse
  > = rawResults.map((result) => {
    return {
      ...result,
      hits: (result as SearchResponse<THit>).hits?.map((hit) => {
        // Bring support for the Insights plugin.
        return {
          ...hit,
          __autocomplete_indexName: (result as SearchResponse<THit>).index,
          __autocomplete_queryID: (result as SearchResponse<THit>).queryID,
        };
      }),
    };
  });

  return {
    results,
    hits: results
      .map((result) => (result as SearchResponse<THit>).hits)
      .filter(Boolean),
    facetHits: results
      .map((result) =>
        (result as SearchForFacetValuesResponse).facetHits?.map((facetHit) => {
          // Bring support for the highlighting components.
          return {
            label: facetHit.value,
            count: facetHit.count,
            _highlightResult: {
              label: {
                value: facetHit.highlighted,
              },
            },
          };
        })
      )
      .filter(Boolean),
  };
}
