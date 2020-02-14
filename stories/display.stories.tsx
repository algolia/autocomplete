/** @jsx h */

import { h, render } from 'preact';
import { storiesOf } from '@storybook/html';
import algoliasearch from 'algoliasearch/lite';

import { withPlayground } from '../.storybook/decorators';
import { Autocomplete } from '../packages/autocomplete-react';
import { getAlgoliaHits } from '../packages/autocomplete-presets';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

function Component(props) {
  return (
    <Autocomplete
      {...props}
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
    />
  );
}

storiesOf('Display', module)
  .add(
    'Heading search bar',
    withPlayground(({ container, dropdownContainer }) => {
      render(<Component dropdownContainer={dropdownContainer} />, container);

      return container;
    })
  )
  .add(
    'Left search bar',
    withPlayground(
      ({ container, dropdownContainer }) => {
        render(
          <Component
            dropdownContainer={dropdownContainer}
            dropdownPlacement="start"
          />,
          container
        );

        return container;
      },
      {
        searchBoxPosition: 'start',
      }
    )
  )
  .add(
    'Right search bar',
    withPlayground(
      ({ container, dropdownContainer }) => {
        render(
          <Component
            dropdownContainer={dropdownContainer}
            dropdownPlacement="end"
          />,
          container
        );

        return container;
      },
      {
        searchBoxPosition: 'end',
      }
    )
  );
