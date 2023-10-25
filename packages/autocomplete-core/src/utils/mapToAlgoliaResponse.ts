import type { SearchResponse } from '@algolia/autocomplete-shared';
import type { SearchForFacetValuesResponse } from '@algolia/client-search';

export function mapToAlgoliaResponse<THit>(
  rawResults: Array<SearchResponse<THit> | SearchForFacetValuesResponse>
) {
  return {
    results: rawResults,
    hits: rawResults
      .map((result) => (result as SearchResponse<THit>).hits)
      .filter(Boolean),
    facetHits: rawResults
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
