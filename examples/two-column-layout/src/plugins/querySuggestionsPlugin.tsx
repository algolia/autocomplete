import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

import { ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';

export const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME,
  getSearchParams({ state }) {
    return {
      hitsPerPage: !state.query ? 0 : 10,
    };
  },
});
