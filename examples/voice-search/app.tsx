/** @jsxRuntime classic */
/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import { h } from 'preact';

import '@algolia/autocomplete-theme-classic';
import { createVoiceSearchPlugin } from './voiceSearchPlugin';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

type AutocompleteItem = Hit<{
  brand: string;
  categories: string[];
  description: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  type: string;
  url: string;
}>;

const voiceSearchPlugin = createVoiceSearchPlugin({});

autocomplete<AutocompleteItem>({
  container: '#autocomplete',
  placeholder: 'Search',
  detachedMediaQuery: 'none',
  insights: true,
  plugins: [voiceSearchPlugin],
  getSources({ query }) {
    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults<AutocompleteItem>({
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
          item({ item, components }) {
            return (
              <div className="aa-ItemWrapper">
                <div className="aa-ItemContent">
                  <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
                    <img
                      src={item.image}
                      alt={item.name}
                      width="40"
                      height="40"
                    />
                  </div>

                  <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                      <components.Highlight hit={item} attribute="name" />
                    </div>
                    <div className="aa-ItemContentDescription">
                      By <strong>{item.brand}</strong> in{' '}
                      <strong>{item.categories[0]}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
          noResults() {
            return 'No products matching.';
          },
        },
      },
    ];
  },
});
