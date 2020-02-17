/** @jsx h */

import { h, render } from 'preact';
import { storiesOf } from '@storybook/html';
import algoliasearch from 'algoliasearch/lite';

import { withPlayground } from '../.storybook/decorators';
import { Autocomplete } from '@francoischalifour/autocomplete-react';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-presets';

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
  );
