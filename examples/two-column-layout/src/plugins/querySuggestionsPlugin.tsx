/** @jsx h */
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

import { ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME } from '../constants';
import { searchClient } from '../searchClient';
import { setSmartPreview } from '../setSmartPreview';

export const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: ALGOLIA_PRODUCTS_QUERY_SUGGESTIONS_INDEX_NAME,
  getSearchParams({ state }) {
    return {
      hitsPerPage: !state.query ? 0 : 20,
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
