/** @jsxRuntime classic */
/** @jsx h */
import {
  autocomplete,
  AutocompleteComponents,
  getAlgoliaResults,
} from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
import { h, Fragment } from 'preact';

import '@algolia/autocomplete-theme-classic';

import { createLocalStorageRecentlyViewedItems } from './recentlyViewedItemsPlugin';
import { ProductHit } from './types';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const recentlyViewedItems = createLocalStorageRecentlyViewedItems({
  key: 'RECENTLY_VIEWED',
  limit: 5,
});

autocomplete<ProductHit>({
  container: '#autocomplete',
  placeholder: 'Search',
  openOnFocus: true,
  insights: true,
  plugins: [recentlyViewedItems],
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults<ProductHit>({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  attributesToSnippet: ['name:10', 'description:35'],
                  snippetEllipsisText: '…',
                },
              },
            ],
          });
        },
        onSelect({ item }) {
          recentlyViewedItems.data.addItem({
            id: item.objectID,
            label: item.name,
            image: item.image,
            url: item.url,
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Products</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return (
              <AutocompleteProductItem hit={item} components={components} />
            );
          },
          noResults() {
            return 'No products for this query.';
          },
        },
      },
    ];
  },
});

type ProductItemProps = {
  hit: ProductHit;
  components: AutocompleteComponents;
};

function AutocompleteProductItem({ hit, components }: ProductItemProps) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--alignTop">
          <img src={hit.image} alt={hit.name} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Highlight hit={hit} attribute="name" />
          </div>
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
          type="button"
          title="Select"
          style={{ pointerEvents: 'none' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
