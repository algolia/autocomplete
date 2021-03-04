---
id: autocomplete-js
title: autocomplete
---

Autocomplete JS creates a virtual DOM-based autocomplete experience.

The `autocomplete` function creates an autocomplete experience and attaches it to an element of the DOM. By default, it uses [Preact 10](https://preactjs.com/guide/v10/whats-new/) to render templates.

## Installation

First, you need to install the package.

```bash
yarn add @algolia/autocomplete-js@alpha
# or
npm install @algolia/autocomplete-js@alpha
```

Then import it in your project:

```js
import { autocomplete } from '@algolia/autocomplete-js';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js@alpha"></script>
```

## Example

Make sure to define an empty container in your HTML where to inject your autocomplete.

```js title="HTML"
<div id="autocomplete"></div>
```

This example uses Autocomplete with an Algolia index, along with the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) API client. All Algolia utility functions to retrieve hits and parse results are available directly in the package.

```js title="JavaScript"
import algoliasearch from 'algoliasearch/lite';
import {
  autocomplete,
  getAlgoliaHits,
  reverseHighlightHit,
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
        sourceId: 'querySuggestionsSources',
        getItemInputValue: ({ item }) => item.query,
        getItems({ query }) {
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
            return reverseHighlightHit({ hit: item, attribute: 'query' });
          },
        },
      },
    ];
  },
});
```

## Parameters

The `autocomplete` function accepts all the props that [`createAutocomplete`](/docs/createAutocomplete#reference) supports.

### `container`

> `string | HTMLElement` | **required**

The container for the Autocomplete search input. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). If there are several containers matching the selector, Autocomplete picks up the first one.

import CreateAutocompleteProps from './partials/createAutocomplete-props.md'

<CreateAutocompleteProps />

### `panelContainer`

> `string | HTMLElement`

The container for the Autocomplete panel. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). If there are several containers matching the selector, Autocomplete picks up the first one.

### `panelPlacement`

> `"start" | "end" | "full-width" | "input-wrapper-width"` | defaults to `"input-wrapper-width"`

The panel's horizontal position.

### `classNames`

> `ClassNames`

Class names to inject for each created DOM element. This is useful to style your autocomplete with external CSS frameworks.

```ts
type ClassNames = Partial<{
  detachedCancelButton: string;
  detachedFormContainer: string;
  detachedContainer: string;
  detachedOverlay: string;
  detachedSearchButton: string;
  detachedSearchButtonIcon: string;
  detachedSearchButtonPlaceholder: string;
  form: string;
  input: string;
  inputWrapper: string;
  inputWrapperPrefix: string;
  inputWrapperSuffix: string;
  item: string;
  label: string;
  list: string;
  loadingIndicator: string;
  panel: string;
  panelLayout: string;
  clearButton: string;
  root: string;
  source: string;
  sourceFooter: string;
  sourceHeader: string;
  submitButton: string;
}>;
```

### `render`

> `(params: { children: VNode, state: AutocompleteState<TItem>, sections: VNode[], createElement: Pragma, Fragment: PragmaFrag }) => void`

The function that renders the autocomplete panel. This is useful to customize the rendering, for example, using multi-row or multi-column layouts.

This is the default implementation:

```js
import { render } from 'preact';

autocomplete({
  // ...
  render({ children }, root) {
    render(children, root);
  },
});
```

### `renderNoResults`

> `(params: { children: VNode, state: AutocompleteState<TItem>, sections: VNode[], createElement: Pragma, Fragment: PragmaFrag }) => void`

The function that renders a no results section when there are no hits. This is useful to let the user know that the query returned no results.

There's no default implementation. By default, Autocomplete closes the panel when there's no results. Here's how you can customize this behavior:

```js
import { render } from 'preact';

autocomplete({
  // ...
  renderNoResults({ state }, root) {
    render(`No results for "${state.query}".`, root);
  },
});
```

### `renderer`

#### `createElement`

> `(type: any, props: Record<string, any> | null, ...children: ComponentChildren[]) => VNode` | defaults to `preact.createElement`

The function that create virtual nodes.

It uses [Preact 10](https://preactjs.com/guide/v10/whats-new/)'s `createElement` by default, but you can provide your own implementation.

#### `Fragment`

> defaults to `preact.Fragment`

The component to use to create fragments.

It uses [Preact 10](https://preactjs.com/guide/v10/whats-new/)'s `Fragment` by default, but you can provide your own implementation.

## Returns

The `autocomplete` function returns [state setters](state#setters) and a `refresh` method that updates the UI state.

These setters are useful to control the autocomplete experience from external events.

```js
const {
  setActiveItemId,
  setQuery,
  setCollections,
  setIsOpen,
  setStatus,
  setContext,
  refresh,
} = autocomplete(options);
```
