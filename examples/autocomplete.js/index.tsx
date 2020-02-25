/** @jsx h */

import { h } from 'preact';
import autocomplete, {
  getAlgoliaResults,
  reverseHighlightAlgoliaHit,
  highlightAlgoliaHit,
  snippetAlgoliaHit,
} from '@francoischalifour/autocomplete.js';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search…',
  openOnFocus: true,
  showCompletion: true,
  defaultHighlightedIndex: -1,
  shouldDropdownOpen({ state }) {
    return state.results.some(result => result.suggestions.length > 0);
  },
  getSources({ query, setContext }) {
    return getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'instant_search_demo_query_suggestions',
          query,
          params: {
            hitsPerPage: 3,
          },
        },
        {
          indexName: 'instant_search',
          query,
          params: {
            attributesToSnippet: ['description'],
          },
        },
      ],
    }).then(results => {
      const [querySuggestionsResults, productsResults] = results;
      const querySuggestionsHits = querySuggestionsResults.hits;
      const productsHits = productsResults.hits;

      setContext({
        nbProductsHits: productsResults.nbHits,
      });

      return [
        {
          getInputValue: ({ suggestion }) => suggestion.query + ' ',
          getSuggestions() {
            return querySuggestionsHits;
          },
          onSelect({ setIsOpen }) {
            setIsOpen(true);
          },
          templates: {
            suggestion({ suggestion }) {
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: 28 }}>
                      <svg
                        viewBox="0 0 18 18"
                        width={16}
                        style={{
                          color: 'rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <path
                          d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                          stroke="currentColor"
                          strokeWidth="1.78"
                          fill="none"
                          fillRule="evenodd"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: reverseHighlightAlgoliaHit({
                          hit: suggestion,
                          attribute: 'query',
                        }),
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      width: 28,
                    }}
                  >
                    <svg
                      height="13"
                      viewBox="0 0 13 13"
                      width="13"
                      style={{
                        color: 'rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <path
                        d="m16 7h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17z"
                        transform="matrix(.70710678 .70710678 -.70710678 .70710678 6 -5.313708)"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              );
            },
          },
        },
        {
          getSuggestions() {
            return productsHits;
          },
          getSuggestionUrl({ suggestion }) {
            return suggestion.url;
          },
          templates: {
            header: ({ state }) => (
              <h5 className="suggestions-header">
                Products ({state.context.nbProductsHits})
              </h5>
            ),
            suggestion({ suggestion }) {
              return (
                <a
                  href={suggestion.url}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <div
                    style={{
                      flex: 1,
                      maxWidth: 70,
                      maxHeight: 70,
                      paddingRight: '1rem',
                    }}
                  >
                    <img
                      src={suggestion.image}
                      alt={suggestion.name}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>

                  <div style={{ flex: 3 }}>
                    <h2
                      style={{ fontSize: 'inherit', margin: 0 }}
                      dangerouslySetInnerHTML={{
                        __html: highlightAlgoliaHit({
                          hit: suggestion,
                          attribute: 'name',
                        }),
                      }}
                    />

                    <p
                      style={{
                        margin: '.5rem 0 0 0',
                        color: 'rgba(0, 0, 0, 0.5)',
                      }}
                      dangerouslySetInnerHTML={{
                        __html: snippetAlgoliaHit({
                          hit: suggestion,
                          attribute: 'description',
                        }),
                      }}
                    />
                  </div>
                </a>
              );
            },
          },
        },
      ];
    });
  },
});
