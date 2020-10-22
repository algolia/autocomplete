---
id: autocomplete-js
title: autocomplete
---

This function creates a JavaScript autocomplete experience.

## Example

```js title="HTML"
<div id="autocomplete"></div>
```

```js title="JavaScript"
import algoliasearch from 'algoliasearch/lite';
import {
  autocomplete,
  getAlgoliaHits,
  reverseHighlightItem,
} from '@algolia/autocomplete-js';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocompleteSearch = autocomplete({
  container: '#autocomplete',
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
        templates: {
          item({ item }) {
            return reverseHighlightItem({ item, attribute: 'query' });
          },
        },
      },
    ];
  },
});
```

## Reference

`autocomplete` accepts all the props that [`createAutocomplete`](/docs/createAutocomplete#reference) supports.

### `container`

> `string | HTMLElement` | **required**

The container for the autocomplete search box. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.

import CreateAutocompleteProps from './partials/createAutocomplete-props.md'

<CreateAutocompleteProps />

### `dropdownPlacement`

> `"start" | "end" | "full-width" | "input-wrapper-width" | defaults to `"input-wrapper-width"`

The dropdown horizontal position.

### `classNames`

> `ClassNames`

The class names to inject in each created DOM element. It it useful to design with external CSS frameworks.

```ts
type ClassNames = {
  root?: string;
  form?: string;
  label?: string;
  inputWrapper?: string;
  input?: string;
  completion?: string;
  resetButton?: string;
  dropdown?: string;
  section?: string;
  sectionHeader?: string;
  menu?: string;
  item?: string;
  sectionFooter?: string;
};
```

### `render`

> `(params: { root: HTMLElement, sections: HTMLElement[], state: AutocompleteState<TItem> }) => void`

Function called to render the autocomplete results. It is useful for rendering sections in different row or column layouts.

The default implementation appends all the sections to the root:

```js
autocomplete({
  // ...
  render({ root, sections }) {
    for (const section of sections) {
      root.appendChild(section);
    }
  },
});
```

## Returned props

```js
const {
  setSelectedItemId,
  setQuery,
  setCollections,
  setIsOpen,
  setStatus,
  setContext,
  refresh,
} = autocomplete(options);
```

`autocomplete` returns all the [state setters](state#setters) and `refresh` method that updates the UI state.

These setters are useful to control the autocomplete experience from external events.
