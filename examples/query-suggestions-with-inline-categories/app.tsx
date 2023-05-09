/** @jsxRuntime classic */
/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import algoliasearch from 'algoliasearch/lite';
import { h } from 'preact';

import '@algolia/autocomplete-theme-classic';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    return {
      hitsPerPage: 6,
    };
  },
  categoryAttribute: [
    'instant_search',
    'facets',
    'exact_matches',
    'categories',
  ],
  categoriesPerItem: 2,
  transformSource: ({ source, onTapAhead }) => {
    return {
      ...source,
      templates: {
        ...source.templates,
        item({ item, components }) {
          return (
            <div className="aa-ItemWrapper">
              <div className="aa-ItemContent">
                <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z" />
                  </svg>
                </div>
                <div className="aa-ItemContentBody">
                  <div className="aa-ItemContentTitle">
                    <components.ReverseHighlight hit={item} attribute="query" />
                    {item.__autocomplete_qsCategory && (
                      <span className="aa-ItemContentSubtitle aa-ItemContentSubtitle--inline">
                        <span className="aa-ItemContentSubtitleIcon" /> in{' '}
                        <span className="aa-ItemContentSubtitleCategory">
                          {item.__autocomplete_qsCategory}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="aa-ItemActions">
                <button
                  className="aa-ItemActionButton"
                  title={`Fill query with "${item.query}"`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onTapAhead(item);
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        },
      },
    };
  },
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  openOnFocus: true,
  insights: true,
  plugins: [querySuggestionsPlugin],
});
