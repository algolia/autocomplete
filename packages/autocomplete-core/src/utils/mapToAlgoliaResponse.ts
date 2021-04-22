import type {
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';

export function mapToAlgoliaResponse<THit>(
  results: Array<SearchResponse<THit> | SearchForFacetValuesResponse>
) {
  return {
    results,
    hits: results
      .map((result) => (result as SearchResponse<THit>).hits)
      .filter(Boolean),
    facetHits: results
      .map((result) =>
        (result as SearchForFacetValuesResponse).facetHits?.map((facetHit) => {
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
