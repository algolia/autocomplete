import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { createRedirectUrlPlugin } from '@algolia/autocomplete-plugin-redirect-url';
import algoliasearch from 'algoliasearch/lite';

import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

autocomplete<{ name: string }>({
  container: '#autocomplete',
  placeholder: 'Search',
  openOnFocus: true,
  insights: true,
  plugins: [createRedirectUrlPlugin()],
  getSources({ query }) {
    return [
      {
        sourceId: 'demo-source',
        templates: {
          item(params) {
            const { item, html } = params;
            return html`<a class="aa-ItemLink">${item.name}</a>`;
          },
        },
        getItemInputValue({ item }) {
          return item.name;
        },
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  ruleContexts: ['enable-redirect-url'], // note: only needed for this demo data
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
