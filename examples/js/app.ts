import algoliasearch from 'algoliasearch/lite';
import {
  autocomplete,
  getAlgoliaHits,
  reverseHighlightItem,
} from '@algolia/autocomplete-js';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

type QuerySuggestionHit = { query: string };

autocomplete<QuerySuggestionHit>({
  container: '#autocomplete',
  debug: true,
  // dropdownPlacement: 'start',
  getSources({ query }) {
    return getAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'instant_search_demo_query_suggestions',
          query,
          params: {
            hitsPerPage: 4,
          },
        },
      ],
    }).then((hits) => {
      return [
        {
          getInputValue: ({ suggestion }) => suggestion.query,
          getSuggestions() {
            return hits;
          },
          templates: {
            item({ item }) {
              return reverseHighlightItem<QuerySuggestionHit>({
                item,
                attribute: 'query',
              });
            },
          },
        },
      ];
    });
  },
});
