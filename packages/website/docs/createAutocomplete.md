---
id: createAutocomplete
---

Autocomplete Core exposes primitives to build an autocomplete experience.

The `createAutocomplete` function returns methods to help you create an autocomplete experience from scratch. This is fully headless: you're in charge of [creating your own autocomplete renderer](creating-a-renderer).

:::info

Building a custom renderer is an advanced pattern. You likely don't need it unless you've reached limitations with [`autocomplete-js`](autocomplete-js) and its templating capabilities.

:::

## Installation

First, you need to install the package.

```bash
yarn add @algolia/autocomplete-core@alpha
# or
npm install @algolia/autocomplete-core@alpha
```

Then import it in your project:

```js
import { createAutocomplete } from '@algolia/autocomplete-core';
```

If you don't use a package manager, you can use the HTML `script` element:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-core@alpha"></script>
<script>
  const { createAutocomplete } = window['@algolia/autocomplete-core'];
</script>
```

## Example

This example uses the package along with the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) API client and [`getAlgoliaHits`](getAlgoliaHits) function from the Autocomplete Algolia preset. It returns [a set of functions](#returns) to build an autocomplete experience.

```js
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const autocomplete = createAutocomplete({
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
      },
    ];
  },
});
```

## Parameters

import CreateAutocompleteProps from './partials/createAutocomplete-props.md'

<CreateAutocompleteProps />

## Returns

The `createAutocomplete` function returns [prop getters](prop-getters), [state setters](state#setters), and a `refresh` method that updates the UI state.

```js
const {
  getEnvironmentProps,
  getRootProps,
  getFormProps,
  getInputProps,
  getItemProps,
  getLabelProps,
  getListProps,
  setActiveItemId,
  setQuery,
  setCollections,
  setIsOpen,
  setStatus,
  setContext,
  refresh,
} = createAutocomplete(options);
```
