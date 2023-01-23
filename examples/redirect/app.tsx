// @ts-nocheck
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
import { createRedirectPlugin } from '@algolia/autocomplete-plugin-redirect';

import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch(
  'beta99F17XEZZG',
  '4aa4981b5ce86e389fb5a948a5f552a3'
);

const redirectPlugin = createRedirectPlugin({});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  openOnFocus: true,
  plugins: [redirectPlugin],
  getSources({ query }) {
    return [
      {
        sourceId: 'pokedex',
        transformResponseToRedirect: ({ results }) =>
          results?.[0]?.renderingContent?.redirect,
        templates: {
          item(params) {
            const { item, html } = params;
            return html`<a class="aa-ItemLink">${item.name.english}</a>`;
          },
        },
        getItemInputValue({ item }) {
          return item.name.english;
        },
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'dans_test_index',
                query,
                params: {
                  hitsPerPage: 10,
                },
              },
            ],
          });
        },
      },
    ];
  },
});
