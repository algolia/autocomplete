/** @jsx h */
import {
  autocomplete,
  getAlgoliaHits,
  highlightHit,
} from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import { h, Fragment } from 'preact';

import '@algolia/autocomplete-theme-classic';

import { createLocalStorageRecentlyViewedItems } from './recentlyViewedItemsPlugin';
import { ProductItem, ProductHit } from './types/ProductHit';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const recentlyViewedItems = createLocalStorageRecentlyViewedItems({
  key: 'RECENTLY_VIEWED',
  limit: 5,
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  openOnFocus: true,
  plugins: [recentlyViewedItems],
  getSources({ query }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaHits<ProductItem>({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  clickAnalytics: true,
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
          item({ item }) {
            return <AutocompleteProductItem hit={item} />;
          },
          noResults() {
            return (
              <div className="aa-ItemContent">No products for this query.</div>
            );
          },
        },
      },
    ];
  },
});

type ProductItemProps = {
  hit: ProductHit;
};

function AutocompleteProductItem({ hit }: ProductItemProps) {
  return (
    <Fragment>
      <div className="aa-ItemIcon aa-ItemIcon--align-top">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {highlightHit<ProductHit>({ hit, attribute: 'name' })}
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-TouchOnly aa-ActiveOnly"
          type="button"
          title="Select"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
      </div>
    </Fragment>
  );
}
