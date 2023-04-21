import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';

import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  insights: true,
  getSources({ query }) {
    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
              },
            ],
          });
        },
        templates: {
          item({ item, components, html }) {
            return html`<div class="aa-ItemWrapper">
              <div class="aa-ItemContent">
                <div
                  class="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop"
                >
                  <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="40"
                    height="40"
                  />
                </div>

                <div class="aa-ItemContentBody">
                  <div class="aa-ItemContentTitle">
                    ${components.Highlight({ hit: item, attribute: 'name' })}
                  </div>
                  <div class="aa-ItemContentDescription">
                    By <strong>${item.brand}</strong> in ${' '}
                    <strong>${item.categories[0]}</strong>
                  </div>
                </div>
              </div>
            </div>`;
          },
        },
      },
    ];
  },
  render({ children, render, html }, root) {
    render(html`<div class="aa-SomeResults">${children}</div>`, root);
  },
  renderNoResults({ children, render, html }, root) {
    render(html`<div class="aa-NoResults">${children}</div>`, root);
  },
});
