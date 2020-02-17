# Autocomplete.js

<p align="center">

Autocomplete.js is a JavaScript library that creates a fast and fully-featured auto-completion experience.

</p>

---

[![Version](https://img.shields.io/npm/v/autocomplete.js.svg?style=flat-square)](https://www.npmjs.com/package/autocomplete.js) [![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/autocomplete.js/badge?style=flat-square)](https://www.jsdelivr.com/package/npm/autocomplete.js) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

<details>

<summary><strong>Contents</strong></summary>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Features](#features)
- [Usage](#usage)
- [Installation](#installation)
- [API](#api)
  - [Options](#options)
  - [Sources](#sources)
  - [State](#state)
  - [Global templates](#global-templates)
- [Top-level API](#top-level-api)
  - [`autocomplete`](#autocomplete)
  - [`getAlgoliaHits`](#getalgoliahits)
  - [`getAlgoliaResults`](#getalgoliaresults)
  - [`highlightAlgoliaHit`](#highlightalgoliahit)
  - [`reverseHighlightAlgoliaHit`](#reversehighlightalgoliahit)
  - [`snippetAlgoliaHit`](#snippetalgoliahit)
- [Design](#design)
  - [Search box](#search-box)
  - [Dropdown](#dropdown)
- [Examples](#examples)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

</details>

## Features

- Displays suggestions as you type
- Shows top suggestion as a completion
- Supports custom templates for UI flexibility
- Works well with RTL languages
- Triggers custom hooks to plug your logic
- Plugs easily to Algolia's realtime search engine

## Usage

> [Try it out live](http://codesandbox.io/s/github/francoischalifour/autocomplete.js/tree/next/examples/autocomplete.js)

###### HTML

```html
<body>
  <div id="autocomplete"></div>
</body>
```

###### JavaScript

```js
const items = [
  { value: 'Apple', count: 120 },
  { value: 'Banana', count: 100 },
  { value: 'Cherry', count: 50 },
  { value: 'Orange', count: 150 },
];

autocomplete({
  container: '#autocomplete',
  getSources() {
    return [
      {
        getSuggestions({ query }) {
          return items.filter(item =>
            item.value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
          );
        },
        getInputValue({ suggestion }) {
          return suggestion.value;
        },
        templates: {
          suggestion({ suggestion }) {
            return `<div>${suggestion.value} (${suggestion.count})</div>`;
          },
        },
      },
    ];
  },
});
```

You can learn more about the [options](#options) and the [top-level API](#top-level-api).

## Installation

Autocomplete.js is available on the [npm](https://www.npmjs.com/) registry.

```sh
yarn add @francoischalifour/autocomplete.js@alpha
# or
npm install @francoischalifour/autocomplete.js@alpha
```

If you do not wish to use a package manager, you can use standalone endpoints:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@francoischalifour/autocomplete.js@alpha"></script>

<!-- unpkg -->
<script src="https://unpkg.com/@francoischalifour/autocomplete.js@alpha"></script>
```

## API

### Options

#### `container`

> `string | HTMLElement` | **required**

The container for the autocomplete search box.

#### `getSources`

> `(params: { query: string }) => AutocompleteSource[] | Promise<AutocompleteSource[]>`

Called to fetch the [sources](#sources).

#### `dropdownContainer`

> `string | HTMLElement` | defaults to `document.body`

The container for the autocomplete dropdown.

#### `dropdownPlacement`

> `'start' | 'end'` | defaults to `'start'`

The dropdown placement related to the container.

#### `getDropdownPosition` 🚧

> `(params: { containerRect: ClientRect, dropdownPosition: DropdownPosition }) => DropdownPosition` | defaults to `({ dropdownPosition }) => dropdownPosition`

Called to compute the dropdown position. This function is called at first load and when the window is resized.

<details>

<summary><code>DropdownPosition</code> definition</summary>

```ts
interface DropdownPosition {
  top: number;
  left?: number;
  right?: number;
}
```

</details>

<details>

<summary>Example</summary>

**Removing margins on mobile**

```js
autocomplete({
  // ...
  getDropdownPosition({ dropdownPosition }) {
    // Desktop: we want to return the dropdown position as is.
    if (window.matchMedia('(min-width: 650px)').matches) {
      return dropdownPosition;
    }

    // Mobile: we want to return the dropdown position without left or right
    // margins.
    return { top: dropdownPosition.top };
  },
});
```

</details>

#### `placeholder`

> `string` | defaults to `""`

The text that appears in the search box input when there is no query.

It is fowarded to the [`input`'s placeholder](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefplaceholder).

#### `showCompletion`

> `boolean` | defaults to `false`

Whether to show the highlighted suggestion as completion in the input.

![`showCompletion` preview](https://user-images.githubusercontent.com/6137112/68124812-7e989800-ff10-11e9-88a5-f28c1466b665.png)

#### `minLength`

> `number` | defaults to `1`

The minimum number of characters long the autocomplete opens.

#### `autoFocus`

> `boolean` | defaults to `false`

Whether to focus the search box when the page is loaded.

#### `keyboardShortcuts` 🚧

> `string[]`

The keyboard shortcuts keys to focus the input.

#### `defaultHighlightedIndex`

> `number | null` | defaults to `null`

The default item index to pre-select.

#### `stallThreshold`

> `number` | defaults to `300`

The number of milliseconds that must elapse before the autocomplete experience is stalled. The timeout is set from the moment [`getSources`](#getsources) is called.

When the experience is stalled:

- The CSS class `algolia-autocomplete--stalled` is added to the autocomplete container
- The `status` state is set to `"stalled"` in the [state](#state)

#### `initialState`

> [`State`](#state)

The initial state to apply when the page is loaded.

#### `templates` 🚧

> [`GlobalTemplates`](#global-templates)

Refer to the "[Global Templates](#global-templates)" section.

#### `transformResultsRender` 🚧

> `(results: JSX.Element[]) => JSX.Element | JSX.Element[]`

Called before rendering the results.

Useful to wrap results in containers to organize the display.

<details>

<summary>Example</summary>

```js
autocomplete({
  // ...
  transformResultsRender(results) {
    const [recentSearches, querySuggestions, products] = results;

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {recentSearches}
          {querySuggestions}
        </div>

        <div style={{ flex: 2 }}>{products}</div>
      </div>
    );
  },
});
```

</details>

#### `environment`

> `typeof window` | defaults to `window`

The environment from where your JavaScript is running.

Useful if you're using Autocomplete.js in a different context than [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window).

#### `navigator`

> `Navigator`

API used to redirect users when a suggestion link is open programmatically (using keyboard navigation). It defines how a URL should be open in the current tab, in a new tab and in a new window.

The source needs to specify [`getSuggestionUrl`](#getsuggestionurl) for the suggestion URL to be provided.

<details>

<summary>Example</summary>

```js
autocomplete({
  // ...
  navigator: {
    navigate({ suggestionUrl }) {
      environment.location.assign(suggestionUrl);
    },
    navigateNewTab({ suggestionUrl }) {
      const windowReference = environment.open(suggestionUrl, '_blank');

      if (windowReference) {
        windowReference.focus();
      }
    },
    navigateNewWindow({ suggestionUrl }) {
      environment.open(suggestionUrl, '_blank');
    },
  },
});
```

</details>

#### `onFocus` 🚧

> `(params: { state: AutocompleteState, ...setters }) => void`

Called when the input is focused.

This function is also called when the input is clicked while already having the focus _and_ the dropdown is closed.

#### `onError` 🚧

> `(params: { state: AutocompleteState, ...setters }) => void` | defaults to `({ state }) => throw state.error`

Called when an error is thrown while getting the suggestions.

When an error is caught:

- The error is thrown (default `onError` implementation)
- The CSS class `algolia-autocomplete--errored` is added to the autocomplete container
- The error is available in the [state](#state)

#### `onClick` 🚧

> `(event: MouseEvent, params: { state: AutocompleteState, ...setters, suggestion: any, suggestionValue: string }) => void`

Called when a [`click` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) is fired on an item.

This function is useful to alter the behavior when a special key is held (e.g. keeping the dropdown open when the meta key is used).

#### `onKeyDown` 🚧

> `(event: KeyboardEvent, options: { state: AutocompleteState, ...setters, suggestion?: any, suggestionValue?: string, suggestionUrl?: string }) => void` | defaults to an accessible behavior

Called when a [`keydown` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event) is fired.

This function is useful to alter the behavior when a special key is held.

<details>

<summary>Example</summary>

```js
autocomplete({
  // ...
  onKeyDown(event, { suggestionUrl, suggestion }) {
    if (!suggestionUrl) {
      return;
    }

    if (event.key === 'Enter') {
      if (event.metaKey || event.ctrlKey) {
        const windowReference = window.open(suggestion.url, '_blank');
        windowReference.focus();
      } else if (event.shiftKey) {
        window.open(suggestion.url, '_blank');
      } else if (event.altKey) {
        // Keep native browser behavior
      } else {
        window.location.assign(suggestion.url);
      }
    }
  },
});
```

</details>

#### `onInput` 🚧

> `(params: { query: string, state: AutocompleteState, ...setters }) => void | Promise <void | { state: AutocompleteState }>`

Called when the input changes.

This turns experience is "controlled" mode. You'll be in charge of updating the state with the [top-level API](#autocomplete).

#### `shouldDropdownShow`

> `(params: { state: AutocompleteState }) => boolean` | defaults to `({ state }) => state.suggestions.some(suggestion => suggestion.items.length > 0)`

Called to check whether the dropdown should open based on the Autocomplete state.

The default behavior is to open the dropdown when there are results.

### Sources

An Autocomplete source refers to an object with the following properties:

#### `getInputValue`

> `(params: { suggestion: Suggestion, state: AutocompleteState }) => string` | defaults to `({ state }) => state.query`

Called to get the value of the suggestion. The value is used to fill the search box.

If you do not wish to update the input value when an item is selected, you can return `state.query`.

<details>
  <summary>Example</summary>

```js
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  getInputValue: ({ suggestion }) => suggestion.value,
  // ...
};
```

</details>

#### `getSuggestionUrl`

> `(params: { suggestion: Suggestion, state: AutocompleteState }) => string | undefined`

Called to get the URL of the suggestion. The value is used to add keyboard accessibility features to allow to open suggestions in the current tab, in a new tab or in a new window.

<details>
  <summary>Example</summary>

```js
const items = [
  { value: 'Google', url: 'https://google.com' },
  { value: 'Amazon', url: 'https://amazon.com' },
];

const source = {
  getSuggestionUrl: ({ suggestion }) => suggestion.url,
  // ...
};
```

</details>

#### `getSuggestions`

> `(params: { query: string, state: AutocompleteState, ...setters }) => Suggestion[] | Promise<Suggestion[]>` | **required**

Called when the input changes. You can use this function to filter/search the items based on the query.

<details>
  <summary>Example</summary>

```js
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  getSuggestions({ query }) {
    return items.filter(item => item.value.includes(query));
  },
  // ...
};
```

</details>

#### `templates` 🚧

> **required**

Templates to use for the source. A template supports strings and JSX elements.

##### `header`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template to display before the suggestions.

##### `suggestion`

> `(params: { suggestion: Suggestion, state: AutocompleteState, ...setters }) => string | JSX.Element`

The template for each suggestion.

##### `footer`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template to display after the suggestions.

##### `empty`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template to display when there are no suggestions.

<details>
  <summary>Example</summary>

**Using strings**

```js
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  templates: {
    header() {
      return '<h2>Fruits</h2>';
    },
    suggestion({ suggestion }) {
      return suggestion.value;
    },
    footer() {
      return '<a href="/fruits">See more</a>';
    },
  },
  // ...
};
```

**Using JSX elements**

```jsx
const items = [{ value: 'Apple' }, { value: 'Banana' }];

const source = {
  templates: {
    header() {
      return <h2>Fruits</h2>;
    },
    suggestion({ suggestion }) {
      return suggestion.value;
    },
    footer() {
      return <a href="/fruits">See more</a>;
    },
  },
  // ...
};
```

</details>

#### `onSelect`

> `(params: { state: AutocompleteState, ...setters }) => void` | defaults to `({ setIsOpen }) => setIsOpen(false)`

Called when an item is selected.

#### `classNames` 🚧

> `ClassNames`

CSS classes to add to the template of the source.

<details>

<summary>Example</summary>

```js
const source = {
  classNames: {
    root: 'dropdown',
    list: 'dropdown-menu',
    suggestion: 'dropdown-item',
  },
  // ...
};
```

</details>

##### `root`

> `string`

The CSS class to add to the source root.

##### `list`

> `string`

The CSS class to add to the source list.

##### `suggestion`

> `string`

The CSS class to add to each source suggestion.

##### `header`

> `string`

The CSS class to add to the source header.

##### `footer`

> `string`

The CSS class to add to the source footer.

##### `empty`

> `string`

The CSS class to add to the empty source.

### State

The Autocomplete.js state drives the behavior of the experience.

#### Getters

The state can be initially set with [`initialState`](#initial-state) and it's is passed to all templates.

##### `query`

> `string` | defaults to `''`

The query.

##### `suggestions`

> `Suggestion[]` | defaults to `[]`

The suggestion of all the sources.

<details>

<summary><code>Suggestion</code> definition</summary>

```ts
interface Suggestion<TItem> {
  source: AutocompleteSource;
  items: TItem[];
}
```

</details>

##### `isOpen`

> `boolean` | defaults to `false`

Whether the dropdown is open.

##### `status`

> `'idle' | 'loading' | 'stalled' | 'error'` | defaults to `idle`

The status of the autocomplete experience.

##### `context`

> `object` | defaults to `{}`

The autocomplete context to store data in. It's useful to use custom data in templates.

#### Setters

Each state has a setter that can be used in the lifecycle of Autocomplete.js.

##### `setQuery`

> `(value: string) => void`

Sets the [`query`](#query) value in the state.

##### `setSuggetions`

> `(value: Suggestion[]) => void`

Sets the [`suggestions`](#suggestions) value in the state.

##### `setIsOpen`

> `(value: boolean) => void`

Sets the [`isOpen`](#isopen) value in the state.

##### `setStatus`

> `(value: 'idle' | 'loading' | 'stalled' | 'error') => void`

Sets the [`status`](#status) value in the state.

##### `setContext`

> `(value: object) => void`

Sets the [`context`](#context) value in the state.

<details>
  <summary>Example</summary>

**Storing `nbHits` from the Algolia response**

```js
autocomplete({
  // ...
  getSources({ query, setContext }) {
    return getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'instant_search',
          query,
          params: {
            attributesToSnippet: ['description'],
          },
        },
      ],
    }).then(results => {
      const productsResults = results[0];

      setContext({
        nbProducts: productsResults.nbHits,
      });

      return [
        {
          // ...
          templates: {
            header({ state }) {
              return `<h2>Products (${state.context.nbProducts})</h2>`;
            },
          },
        },
      ];
    });
  },
});
```

</details>

### Global templates 🚧

In addition to the source templates, Autocomplete.js supports some global templates.

#### `header`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template to display before all sources.

#### `footer`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template to display after all sources.

#### `submitIcon`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template for the submit icon.

#### `resetIcon`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template for the reset icon. The template for the submit icon.

#### `loadingIcon`

> `(params: { state: AutocompleteState, ...setters }) => string | JSX.Element`

The template for the loading icon.

## Top-level API

### `autocomplete` 🚧

`autocomplete` is the default export from the `autocomplete.js` package. It is the main function that starts the autocomplete experience and accepts [options](#options).

The `autocomplete` function returns an API that allows you to turn Autocomplete.js in a "controlled" mode. It returns all the [setters](#setters) so that you update the state of the experience.

```js
// Instantiate Autocomplete.js
const autocompleteSearch = autocomplete({
  // options
});

// Retrieve the state of your app that you want to forward to Autocomplete.js
const app = getAppState();

// Update the state of Autocomplete.js based on your app state
autocompleteSearch.setQuery(app.query);
autocompleteSearch.setSuggestions(
  app.indices.map(index => {
    return {
      source: getSource({ index }),
      items: index.hits,
    };
  })
);
autocompleteSearch.setIsOpen(app.isOpen);
autocompleteSearch.setIsLoading(app.isLoading);
autocompleteSearch.setIsStalled(app.isStalled);
autocompleteSearch.setContext(app.context);
```

### `getAlgoliaHits`

> `(params: { searchClient: SearchClient, query: string, searchParameters: SearchParameters[] }) => Promise<Response['hits']>`

Function that retrieves and merges Algolia hits from multiple indices.

This function comes with default Algolia search parameters:

- [`hitsPerPage`](https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/): `5`
- [`highlightPreTag`](https://www.algolia.com/doc/api-reference/api-parameters/highlightPreTag/): `<mark>`
- [`highlightPostTag`](https://www.algolia.com/doc/api-reference/api-parameters/highlightPostTag/): `</mark>`

<details>
  <summary>Example</summary>

```js
import autocomplete, { getAlgoliaHits } from 'autocomplete.js';
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        getSuggestions({ query }) {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  hitsPerPage: 3,
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

</details>

### `getAlgoliaResults`

> `(params: { searchClient: SearchClient, query: string, searchParameters: SearchParameters[] }) => Promise<MultiResponse['results']>`

Function that retrieves Algolia results from multiple indices.

This function comes with default Algolia search parameters:

- [`hitsPerPage`](https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/): `5`
- [`highlightPreTag`](https://www.algolia.com/doc/api-reference/api-parameters/highlightPreTag/): `<mark>`
- [`highlightPostTag`](https://www.algolia.com/doc/api-reference/api-parameters/highlightPostTag/): `</mark>`

<details>
  <summary>Example</summary>

```js
import autocomplete, { getAlgoliaResults } from 'autocomplete.js';
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        getSuggestions({ query }) {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  hitsPerPage: 3,
                },
              },
            ],
          }).then(results => {
            const firstResult = results[0];

            return firstResult.hits;
          });
        },
      },
    ];
  },
});
```

</details>

### `highlightAlgoliaHit`

Highlights and escapes the value of a record.

<details>

<summary>Example</summary>

```js
import autocomplete, { highlightAlgoliaHit } from 'autocomplete.js';

autocomplete({
  // ...
  templates: {
    suggestion({ suggestion }) {
      return highlightAlgoliaHit({
        hit: suggestion,
        attribute: 'name',
      });
    },
  },
});
```

</details>

### `reverseHighlightAlgoliaHit`

This function reverse-highlights and escapes the value of a record.

It's useful when following the pattern of [Query Suggestions](https://www.algolia.com/doc/guides/getting-insights-and-analytics/leveraging-analytics-data/query-suggestions/) to highlight the difference between what the user types and the suggestion shown.

<details>

<summary>Example</summary>

```js
import autocomplete, { reverseHighlightAlgoliaHit } from 'autocomplete.js';

autocomplete({
  // ...
  templates: {
    suggestion({ suggestion }) {
      return reverseHighlightAlgoliaHit({
        hit: suggestion,
        attribute: 'query',
      });
    },
  },
});
```

</details>

### `snippetAlgoliaHit`

Highlights and escapes the snippet value of a record.

<details>

<summary>Example</summary>

```js
import autocomplete, { snippetAlgoliaHit } from 'autocomplete.js';

autocomplete({
  // ...
  templates: {
    suggestion({ suggestion }) {
      return snippetAlgoliaHit({
        hit: suggestion,
        attribute: 'name',
      });
    },
  },
});
```

</details>

## Design

### Search box

<details>

<summary>HTML output</summary>

```html
<div
  class="algolia-autocomplete"
  role="combobox"
  aria-haspopup="listbox"
  aria-labelledby="autocomplete-0-label"
>
  <form role="search" novalidate="" class="algolia-autocomplete-form">
    <label
      for="autocomplete-0-input"
      class="algolia-autocomplete-magnifierLabel"
    >
      <svg>
        ...
      </svg>
    </label>

    <div class="algolia-autocomplete-loadingIndicator">
      <svg>
        ...
      </svg>
    </div>

    <div class="algolia-autocomplete-searchbox">
      <input
        id="autocomplete-0-input"
        class="algolia-autocomplete-input"
        aria-autocomplete="list"
        aria-labelledby="autocomplete-0-label"
        autocomplete="off"
        placeholder="Search…"
        type="search"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        maxlength="512"
      />
    </div>

    <button
      type="reset"
      title="Clear the query"
      class="algolia-autocomplete-reset"
      hidden="true"
    >
      <svg>
        ...
      </svg>
    </button>
  </form>
</div>
```

</details>

### Dropdown

<details>

<summary>HTML output</summary>

```html
<div class="algolia-autocomplete-dropdown">
  <div class="algolia-autocomplete-dropdown-container">
    <header class="algolia-autocomplete-header">
      Global header
    </header>

    <section class="algolia-autocomplete-suggestions">
      <header class="algolia-autocomplete-suggestions-header">
        <h2>Fruits</h2>
      </header>

      <ul
        id="autocomplete-0-menu"
        role="listbox"
        aria-labelledby="autocomplete-0-label"
      >
        <li
          class="algolia-autocomplete-suggestions-item"
          id="autocomplete-0-item-0"
          role="option"
          tabindex="0"
        >
          Apple
        </li>
        <li
          class="algolia-autocomplete-suggestions-item"
          id="autocomplete-0-item-1"
          role="option"
          tabindex="0"
        >
          Banana
        </li>
      </ul>

      <footer class="algolia-autocomplete-suggestions-footer">
        Showing 2 out of 10 fruits
      </footer>
    </section>

    <footer class="algolia-autocomplete-footer">
      Global footer
    </footer>
  </div>
</div>
```

</details>

## Examples

<!-- TODO -->

## Browser support

<!-- TODO -->

## Contributing

Please refer to the [contributing guide](CONTRIBUTING.md).

## License

Autocomplete.js is [MIT licensed](LICENSE).
