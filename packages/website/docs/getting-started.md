---
id: getting-started
title: Getting Started
---

Check out the different ways to learn how to use Autocomplete, including following a basic implementation.

This documentation offers a few ways to learn about the Autocomplete library:
  - Read the [**Core Concepts**](/docs/basic-options) to learn more about underlying principles, like [**Sources**](/docs/sources) and [**State**](/docs/state).
  - Follow the [**Guides**](/docs/using-query-suggestions-plugin) to understand how to build common UX patterns.
  - Refer to [**API reference**](/docs/api) for a comprehensive list of parameters and options.
  - Try out the [**Playground**](https://codesandbox.io/s/github/algolia/autocomplete.js/tree/next/examples/js?file=/app.ts) where you can fork a basic implementation and play around.

Keep reading to see how to install and start a basic implementation.

## Installation

You can choose to [install the `autocomplete-js` package](#javascript) which includes everything you need to render a JavaScript autocomplete experience, or [install the `autocomplete-core` package](#headless) if you want to [build a renderer](creating-a-renderer) from scratch.

Unless you've found that [`autocomplete-js`](/autocomplete-js) doesn't suit your needs, it's best to get started with that.

The Autocomplete library is available on the [npm](https://www.npmjs.com/) registry.

### JavaScript

```bash
yarn add @algolia/autocomplete-js@alpha
# or
npm install @algolia/autocomplete-js@alpha
```

If you don't want to use a package manager, you can use standalone endpoints:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js@alpha"></script>

<!-- unpkg -->
<script src="https://unpkg.com/@algolia/autocomplete-js@alpha"></script>
```

### Headless

```bash
yarn add @algolia/autocomplete-core@alpha
# or
npm install @algolia/autocomplete-core@alpha
```

If you don't want to use a package manager, you can use standalone endpoints:

```html
<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-core@alpha"></script>

<!-- unpkg -->
<script src="https://unpkg.com/@algolia/autocomplete-core@alpha"></script>
```

## Choosing a container

To get started, you need to select a container you want your autocomplete to go in. If you don't have one already, you can insert one into your markup:

```js title="HTML"
<div id="autocomplete"></div>
```

Then, insert your autocomplete into it by calling the `autocomplete` function and providing the `container`:

```js title="JavaScript"
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  container: '#autocomplete',
  getSources() {
    return [/* ... */];
  },
});
```

Autocomplete is now plugged in. But you won't see anything appear until you define your [sources](/docs/sources).

## Defining your sources

[Sources](/docs/sources) define where to retrieve the items to display in your autocomplete dropdown. Sources can be a static array or be dynamic.

This example uses the [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) that's [powering the documentation search](https://docsearch.algolia.com/) on this site as a source. The `autocomplete-js` library provides a built-in [`getAlgoliaHits`](getAlgoliaHits) function for just this purpose.

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from "@algolia/autocomplete-js";

const searchClient = algoliasearch(
  'BH4D9OD16A',
  'a5c3ccfd361b8bcb9708e679c43ae0e5'
);

autocomplete({
  container: '#autocomplete',
  getSources({ query }) {
    return [
      {
        getItems({ query }) {
          return getAlgoliaHits({
            searchClient,
            queries: [{ indexName: "autocomplete", query }]
          });
        },
      },
    ];
  },
});
```
[Sources](/docs/sources) also define *how* to display items in your Autocomplete using [`templates`](/docs/templates):

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from "@algolia/autocomplete-js";

const searchClient = algoliasearch(
  'BH4D9OD16A',
  'a5c3ccfd361b8bcb9708e679c43ae0e5'
);

autocomplete({
  container: "#autocomplete",
  getSources({ query }) {
    return [
      {
        getItems({ query }) {
          return getAlgoliaHits({
            searchClient,
            queries: [{ indexName: "autocomplete", query }]
          });
        },
        templates: {
          item({ item }) {
            return item.content;
          }
        }
      }
    ];
  }
});
```

That creates a basic implementation. To make it more useful, you can use the [`getItemUrl`](/docs/sources#getitemurl) to add [keyboard accessibility](keyboard-navigation) features. It lets users open items directly from the autocomplete.

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from "@algolia/autocomplete-js";

const searchClient = algoliasearch(
  'BH4D9OD16A',
  'a5c3ccfd361b8bcb9708e679c43ae0e5'
);

autocomplete({
  container: "#autocomplete",
  getSources({ query }) {
    return [
      {
        getItems({ query }) {
          return getAlgoliaHits({
            searchClient,
            queries: [{ indexName: "autocomplete", query }]
          })
        },
        templates: {
          item({ item }) {
            return item.content;
          }
        },
        getItemUrl({ item }) {
            return item.url;
        }
      }
    ];
  }
});
```

## Going further

This outlines a very simple autocomplete implementation. There's a lot more you can do, like [adding multiple sources](/docs/creating-multi-source-autocompletes), using [templates for headers, footers](/docs/templates#rendering-a-header-and-footer), or when there's [no results](/docs/templates#rendering-an-empty-state). To learn about customization options, read more about the [**Core Concepts**](/docs/basic-options) or follow one of the [**Guides**](/docs/using-query-suggestions-plugin).
