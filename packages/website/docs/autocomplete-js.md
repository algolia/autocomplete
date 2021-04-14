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

If you don't use a package manager, you can use the HTML `script` element:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js@alpha"></script>
<script>
  const { autocomplete } = window['@algolia/autocomplete-js'];
</script>
```

## Example

Make sure to define an empty container in your HTML where to inject your autocomplete.

```js title="HTML"
<div id="autocomplete"></div>
```

This example uses Autocomplete with an Algolia index, along with the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) API client. All Algolia utility functions to retrieve hits and parse results are available directly in the package.

```jsx title="JavaScript"
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocompleteSearch = autocomplete({
  container: '#autocomplete',
  getSources() {
    return [
      {
        sourceId: 'querySuggestions',
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
          item({ item, components }) {
            return <components.ReverseHighlight hit={item} attribute="query" />;
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

The container for the Autocomplete search box. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). If there are several containers matching the selector, Autocomplete picks up the first one.

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

### `components`

Components to register in the Autocomplete rendering lifecycles. Registered components become available in [`templates`](templates), [`render`](#render), and in [`renderNoResults`](#rendernoresults).

```jsx
import { render } from 'preact';
import { MyComponent } from './my-components';

autocomplete({
  // ...
  components: {
    MyComponent,
  },
  render({ sections, components }, root) {
    render(
      <Fragment>
        <div className="aa-PanelLayout aa-Panel--scollable">{sections}</div>
        <components.MyComponent />
      </Fragment>,
      root
    );
  },
});
```

Four components are registered by default:

- `Highlight` to highlight matches in Algolia results
- `Snippet` to snippet matches in Algolia results
- `ReverseHighlight` to reverse highlight matches in Algolia results
- `ReverseSnippet` to reverse highlight and snippet matches in Algolia results

```jsx
autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        getItems() {
          return [
            /* ... */
          ];
        },
        templates: {
          item({ item, components }) {
            return <components.Highlight hit={item} attribute="name" />;
          },
        },
      },
    ];
  },
});
```

### `render`

> `(params: { children: VNode, elements: Elements, sections: VNode[], state: AutocompleteState<TItem>, createElement: Pragma, Fragment: PragmaFrag }) => void`

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

You can use `sections`, which holds the components tree of your autocomplete, to customize the wrapping layout.

```js
import { render } from 'preact';

autocomplete({
  // ...
  render({ sections }, root) {
    render(
      <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>,
      root
    );
  },
});
```

If you need to split the content across a more complex layout, you can use `elements` instead to pick which source to display based on its [`sourceId`](sources#sourceid).

```js
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import algoliasearch from 'algoliasearch';
import { render } from 'preact';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'search',
});
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});

autocomplete({
  // ...
  plugins: [recentSearchesPlugin, querySuggestionsPlugin],
  getSources({ query }) {
    return [
      {
        sourceId: 'products',
        // ...
      },
    ];
  },
  render({ elements }, root) {
    const { recentSearchesPlugin, querySuggestionsPlugin, products } = elements;

    render(
      <div className="aa-PanelLayout aa-Panel--scrollable">
        <div>
          {recentSearchesPlugin}
          {querySuggestionsPlugin}
        </div>
        <div>{products}</div>
      </div>,
      root
    );
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

The virtual DOM implementation to plug to Autocomplete. It defaults to Preact.

#### `createElement`

> `(type: any, props: Record<string, any> | null, ...children: ComponentChildren[]) => VNode` | defaults to `preact.createElement`

The function that create virtual nodes.

It uses [Preact 10](https://preactjs.com/guide/v10/whats-new/)'s `createElement` by default, but you can provide your own implementation.

#### `Fragment`

> defaults to `preact.Fragment`

The component to use to create fragments.

It uses [Preact 10](https://preactjs.com/guide/v10/whats-new/)'s `Fragment` by default, but you can provide your own implementation.

### `detachedMediaQuery`

> `string` | defaults to `"(max-width: 680px)"`

The Detached Mode turns the dropdown display into a full screen, modal experience.

See [**Detached Mode**](detached-mode) for more information.

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
  update,
  destroy,
} = autocomplete(options);
```

## Helpers

### `refresh`

> `() => Promise<void>`

Updates the UI state. You must call this function whenever you mutate the state with setters and want to reflect the changes in the UI.

### `update`

> `(updatedOptions: Partial<AutocompleteOptions>) => void`

Updates the Autocomplete instance with new options.

### `destroy`

> `() => void`

Destroys the Autocomplete instance, cleans up the DOM mutations and event listeners.
