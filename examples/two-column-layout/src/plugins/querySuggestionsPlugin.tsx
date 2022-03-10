/** @jsx h */
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

import { ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME } from '../constants';
import { setSmartPreview } from '../functions';
import { searchClient } from '../searchClient';

export const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME,
  getSearchParams({ state }) {
    return {
      hitsPerPage: !state.query ? 0 : 8,
    };
  },
  transformSource({ source }) {
    return {
      ...source,
      onActive(params) {
        setSmartPreview({
          preview: {
            query: params.itemInputValue,
          },
          ...params,
        });
      },
    };
  },
});
