---
id: createAutocomplete
---

This function returns the methods to create an autocomplete experience.

# Example

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

# Reference

## Required props

### `getSources`

The [sources](sources) to get the suggestions from.

## Optional props

### `id`

> `string` | defaults to `"autocomplete-0"` (incremented for each instance)

The autocomplete ID to create accessible attributes.

### `onStateChange`

> `(params: { state: AutocompleteState<TItem> }) => void`

Function called when the internal state changes.

### `placeholder`

> `string`

The text that appears in the search box input when there is no query.

### `autoFocus`

> `boolean` | defaults to `false`

Whether to focus the search box when the page is loaded.

### `defaultHighlightedIndex`

> `number | null` | default to `null`

The default item index to pre-select.

We recommend using `0` when the query typed aims at opening suggestion links, without triggering an actual search.

### `showCompletion`

> `boolean` | defaults to `false`

Whether to show the highlighted suggestion as completion in the input.

### `openOnFocus`

> `boolean` | defaults to `false`

Whether to open the dropdown on focus when there's no query.

### `stallThreshold`

> `number` | defaults to `300`

The number of milliseconds that must elapse before the autocomplete experience is stalled.

### `initialState`

> `Partial<AutocompleteState>`

The initial state to apply when autocomplete is created.

### `environment`

> `typeof window` | defaults to `window`

The environment from where your JavaScript is running.

Useful if you're using autocomplete in a different context than `window`.

### `navigator`

> `Navigator`

Navigator API to redirect the user when a link should be opened.

Learn more on the [Navigator API](navigator-api) documentation.

### `shouldDropdownShow`

> `(params: { state: AutocompleteState }) => boolean`

The function called to determine whether the dropdown should open.

By default, it opens when there are suggestions in the state.

### `onSubmit`

> `(params: { state: AutocompleteState, event: Event, ...setters }) => void`

The function called when the autocomplete form is submitted.

### `onInput`

> `(params: {query: string, state: AutocompleteState, ...setters }) => void`

The function called when the input changes.

This turns the experience in controlled mode, leaving you in charge of updating the state.

## Returned props

```js {2-14}
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
} = createAutocomplete(options);
```

This function returns the [prop getters](prop-getters) and the [state setters](state#setters)
