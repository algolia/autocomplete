---
id: createAutocomplete
---

This function returns the methods to create an autocomplete experience.

## Example

```js
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@francoischalifour/autocomplete-core';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getInputValue: ({ suggestion }) => suggestion.query,
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
  },
});
```

## Options

import CreateAutocompleteProps from './partials/createAutocomplete-props.md'

<CreateAutocompleteProps />

## Returns

```js
const {
  getEnvironmentProps,
  getRootProps,
  getFormProps,
  getInputProps,
  getItemProps,
  getLabelProps,
  getMenuProps,
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
  refresh,
} = createAutocomplete(options);
```

This function returns the [prop getters](prop-getters), the [state setters](state#setters) and the `refresh` method that updates the UI state.
