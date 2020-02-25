/** @jsx h */

import { h, render } from 'preact';
import { storiesOf } from '@storybook/html';
import algoliasearch from 'algoliasearch/lite';

import { Autocomplete } from '@francoischalifour/autocomplete-react';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';
import { withPlayground } from '../.storybook/decorators';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

storiesOf('React', module)
  .add(
    'Component',
    withPlayground(({ container, dropdownContainer }) => {
      render(
        <Autocomplete
          placeholder="Search items…"
          showCompletion={true}
          dropdownContainer={dropdownContainer}
          defaultHighlightedIndex={null}
          getSources={() => {
            return [
              {
                getInputValue({ suggestion }) {
                  return suggestion.query;
                },
                getSuggestions({ query }) {
                  return getAlgoliaHits({
                    searchClient,
                    queries: [
                      {
                        indexName: 'instant_search_demo_query_suggestions',
                        query,
                        params: {
                          hitsPerPage: 4,
                        },
                      },
                    ],
                  });
                },
              },
            ];
          }}
        />,
        container
      );

      return container;
    })
  )
  .add(
    'Dropdown stays open onSelect',
    withPlayground(({ container, dropdownContainer }) => {
      render(
        <Autocomplete
          placeholder="Search items…"
          showCompletion={true}
          dropdownContainer={dropdownContainer}
          getSources={() => {
            return [
              {
                getInputValue({ suggestion }) {
                  return suggestion.query;
                },
                onSelect(props) {
                  props.setIsOpen(true);
                },
                getSuggestions({ query }) {
                  return getAlgoliaHits({
                    searchClient,
                    queries: [
                      {
                        indexName: 'instant_search_demo_query_suggestions',
                        query,
                        params: {
                          hitsPerPage: 4,
                        },
                      },
                    ],
                  });
                },
              },
            ];
          }}
        />,
        container
      );

      return container;
    })
  )
  .add(
    'Replaces query onHighlight',
    withPlayground(({ container, dropdownContainer }) => {
      render(
        <Autocomplete
          placeholder="Search items…"
          dropdownContainer={dropdownContainer}
          getSources={() => {
            return [
              {
                getInputValue({ suggestion }) {
                  return suggestion.query;
                },
                onHighlight({ suggestionValue, setQuery, event }) {
                  if (event.type === 'keydown') {
                    setQuery(suggestionValue);
                  }
                },
                getSuggestions({ query }) {
                  return getAlgoliaHits({
                    searchClient,
                    queries: [
                      {
                        indexName: 'instant_search_demo_query_suggestions',
                        query,
                        params: {
                          hitsPerPage: 4,
                        },
                      },
                    ],
                  });
                },
              },
            ];
          }}
        />,
        container
      );

      return container;
    })
  )
  .add(
    'Long list of items',
    withPlayground(({ container, dropdownContainer }) => {
      render(
        <Autocomplete
          placeholder="Search items…"
          dropdownContainer={dropdownContainer}
          getSources={() => {
            return [
              {
                getInputValue({ suggestion }) {
                  return suggestion.query;
                },
                getSuggestions({ query }) {
                  return getAlgoliaHits({
                    searchClient,
                    queries: [
                      {
                        indexName: 'instant_search_demo_query_suggestions',
                        query,
                        params: {
                          hitsPerPage: 40,
                        },
                      },
                    ],
                  });
                },
              },
            ];
          }}
        />,
        container
      );

      return container;
    })
  )
  .add(
    'Controlled mode',
    withPlayground(({ container, dropdownContainer }) => {
      render(
        <Autocomplete
          placeholder="Search items…"
          dropdownContainer={dropdownContainer}
          onInput={({
            query,
            setHighlightedIndex,
            setQuery,
            setSuggestions,
            setIsOpen,
          }) => {
            setQuery(query);

            if (query.length < 1) {
              setHighlightedIndex(null);
              setIsOpen(false);
              setSuggestions([
                {
                  source: {
                    getInputValue: ({ suggestion }) => suggestion.query,
                    getSuggestionUrl: () => undefined,
                    getSuggestions: () => [],
                    onSelect: () => {},
                    onHighlight: () => {},
                  },
                  items: [],
                },
              ]);

              return;
            }

            getAlgoliaHits({
              searchClient,
              queries: [
                {
                  indexName: 'instant_search_demo_query_suggestions',
                  query,
                },
              ],
            }).then(items => {
              setHighlightedIndex(null);
              setIsOpen(items.length > 0);
              setSuggestions([
                {
                  source: {
                    getInputValue: ({ suggestion }) => suggestion.query,
                    getSuggestionUrl: () => undefined,
                    getSuggestions: () => items,
                    onSelect: () => {},
                    onHighlight: () => {},
                  },
                  items,
                },
              ]);
            });
          }}
          getSources={() => {
            return [];
          }}
        />,
        container
      );

      return container;
    })
  )
  .add(
    'Open on focus',
    withPlayground(({ container, dropdownContainer }) => {
      render(
        <Autocomplete
          placeholder="Search items…"
          showCompletion={true}
          dropdownContainer={dropdownContainer}
          defaultHighlightedIndex={0}
          openOnFocus={true}
          getSources={() => {
            return [
              {
                getInputValue({ suggestion }) {
                  return suggestion.query;
                },
                getSuggestions({ query }) {
                  return getAlgoliaHits({
                    searchClient,
                    queries: [
                      {
                        indexName: 'instant_search_demo_query_suggestions',
                        query,
                        params: {
                          hitsPerPage: 4,
                        },
                      },
                    ],
                  });
                },
              },
            ];
          }}
        />,
        container
      );

      return container;
    })
  );
