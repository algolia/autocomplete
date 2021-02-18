import {
  searchForFacetValues,
  SearchForFacetValuesParams,
} from './searchForFacetValues';

type FacetHit = {
  label: string;
  count: number;
  _highlightResult: {
    label: {
      value: string;
    };
  };
};

export function getAlgoliaFacetHits({
  searchClient,
  queries,
  userAgents,
}: SearchForFacetValuesParams): Promise<FacetHit[][]> {
  return searchForFacetValues({ searchClient, queries, userAgents }).then(
    (response) => {
      return response.map((result) =>
        result.facetHits.map((facetHit) => {
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
      );
    }
  );
}
