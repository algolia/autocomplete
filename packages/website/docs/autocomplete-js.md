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

## Import

```ts
import { autocomplete } from '@algolia/autocomplete-js';
```

## Params

`autocomplete` accepts all the props that [`createAutocomplete`](/docs/createAutocomplete#reference) supports.

### `container`

> `string | HTMLElement` | **required**

The container for the Autocomplete search box. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.

import CreateAutocompleteProps from './partials/createAutocomplete-props.md'

<CreateAutocompleteProps />

### `panelContainer`

> `string | HTMLElement`

The container for the Autocomplete panel. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.

### `panelPlacement`

> `"start" | "end" | "full-width" | "input-wrapper-width"` | defaults to `"input-wrapper-width"`

The panel horizontal position.

### `classNames`

> `ClassNames`

The class names to inject in each created DOM element. It it useful to design with external CSS frameworks.

```ts
type ClassNames = Partial<{
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
  resetButton: string;
  root: string;
  source: string;
  sourceFooter: string;
  sourceHeader: string;
  submitButton: string;
  touchCancelButton: string;
  touchFormContainer: string;
  touchOverlay: string;
  touchSearchButton: string;
  touchSearchButtonIcon: string;
  touchSearchButtonPlaceholder: string;
}>;
```

### `render`

> `(params: { children: VNode, state: AutocompleteState<TItem> }) => void`

Function called to render the autocomplete panel. It is useful for rendering sections in different row or column layouts.

Default implementation:

```js
import { render } from 'preact';

autocomplete({
  // ...
  render({ children }, root) {
    render(children, root);
  },
});
```

### `renderer`

#### `createElement`

> `(type: any, props: Record<string, any> | null, ...children: ComponentChildren[]) => VNode` | defaults to `preact.createElement`

Function used to create elements.

#### `Fragment`

> defaults to `preact.Fragment`

Component used for fragments.

## Returned props

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

`autocomplete` returns all the [state setters](state#setters) and `refresh` method that updates the UI state.

These setters are useful to control the autocomplete experience from external events.
