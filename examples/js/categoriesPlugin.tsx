/** @jsx h */
import {
  AutocompletePlugin,
  getAlgoliaFacetHits,
  highlightHit,
} from '@algolia/autocomplete-js';
import { Hit } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';
import { h, Fragment } from 'preact';

type CategoryItem = {
  label: string;
  count: number;
};

type CreateCategoriesPluginProps = {
  searchClient: SearchClient;
};

export function createCategoriesPlugin({
  searchClient,
}: CreateCategoriesPluginProps): AutocompletePlugin<CategoryItem, undefined> {
  return {
    getSources({ query }) {
      return [
        {
          sourceId: 'categoriesPlugin',
          getItems() {
            return getAlgoliaFacetHits({
              searchClient,
              queries: [
                {
                  indexName: 'instant_search',
                  params: {
                    facetName: 'categories',
                    facetQuery: query,
                    maxFacetHits: query ? 3 : 10,
                  },
                },
              ],
            });
          },
          templates: {
            header() {
              return (
                <Fragment>
                  <span className="aa-SourceHeaderTitle">Categories</span>
                  <div className="aa-SourceHeaderLine" />
                </Fragment>
              );
            },
            item({ item }) {
              return (
                <Fragment>
                  <div className="aa-ItemIcon aa-ItemIcon--no-border">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div className="aa-ItemContent">
                    <div className="aa-ItemContentTitle">
                      {highlightHit<Hit<CategoryItem>>({
                        hit: item as any,
                        attribute: 'label',
                      })}
                    </div>
                  </div>
                </Fragment>
              );
            },
          },
        },
      ];
    },
  };
}
