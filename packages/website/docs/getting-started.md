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

Unless you've found that [`autocomplete-js`](/docs/autocomplete-js) doesn't suit your needs, it's best to get started with that.

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

## Selecting a container

To get started, you need to select a container you want your autocomplete to go in. If you don't have one already, you can insert one into your markup:

```js title="HTML"
<div id="autocomplete"></div>
```

Then, insert your autocomplete into it by calling the [`autocomplete`](/docs/autocomplete-js) function and providing the [`container`](/docs/autocomplete-js/#container). It can be a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). Make sure to provide a container (e.g., a `div`), not an `input`. Autocomplete generates a fully accessible search box for you.

```js title="JavaScript"
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  container: '#autocomplete',
  placeholder: "Search the autocomplete documentation",
  openOnFocus: true,
  getSources() {
    return [/* ... */];
  },
});
```
The [`placeholder`](/docs/autocomplete-js#placeholder) option defines the placeholder text used until the user starts typing in the input. The [`openOnFocus`](/docs/autocomplete-js#openonfocus) option defines whether to open the panel on [focus](https://developer.mozilla.org/en-US/docs/Web/API/Window/focus_event), when there's no query. It defaults to `false`, so you need to set it to `true` if you want the dropdown to appear as soon as a user clicks on it.

Autocomplete is now plugged in. But you won't see anything appear until you define your [sources](/docs/sources).

## Defining your sources

[Sources](/docs/sources) define where to retrieve the items to display in your autocomplete dropdown. You define your sources in the [`getSources`](/docs/sources#getsources) function by returning an array of [source objects](/sources#sources). Each source object needs to include a [`getItems`](/docs/sources#getitems) property that returns the items to display. Sources can be a static array or be dynamic.

This example uses the [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) that's [powering the documentation search](https://docsearch.algolia.com/) on this site as a source. The [`autocomplete-js`](/docs/autocomplete-js) library provides a built-in [`getAlgoliaHits`](getAlgoliaHits) function for just this purpose.

```js title="JavaScript"
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from "@algolia/autocomplete-js";

const searchClient = algoliasearch(
  'BH4D9OD16A',
  'a5c3ccfd361b8bcb9708e679c43ae0e5'
);

autocomplete({
  container: "#autocomplete",
  placeholder: "Search documentation",
  openOnFocus: true,
  getSources({ query }) {
    return [
      {
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: "autocomplete",
                query,
                params: {
                  hitsPerPage: 10
                }
              }
            ]
          });
        },
      }
    ];
  }
});
```

The `searchClient` requires an [Algolia application ID and API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id). It lets you search into your Algolia index using an array of `queries`, which defines the queries you want to make to the index.

This example makes just one query to the "autocomplete" index using the `query` from [`getSources`](/docs/sources#getsources). It passes one additional parameter, [`hitsPerPage`](https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/) to define how many items to display, but you could pass any other [Algolia query parameters](https://www.algolia.com/doc/api-reference/api-parameters/).

### Using templates

[Sources](/docs/sources) also define *how* to display items in your Autocomplete using [`templates`](/docs/templates).  Templates can return a string or anything that's a valid Virtual DOM element. The example creates a [Preact](https://preactjs.com/) component called `AutocompleteItem` as the template for each item to display.

```js title="JavaScript"
/** @jsx h */
import { autocomplete, getAlgoliaHits } from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import { h } from "preact";

const searchClient = algoliasearch(
  "BH4D9OD16A",
  "a5c3ccfd361b8bcb9708e679c43ae0e5"
);

function AutocompleteItem({ hit, breadcrumb }) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">{hit.hierarchy[hit.type]}</div>
        <div className="aa-ItemContentSubtitle">{breadcrumb.join(" • ")}</div>
      </div>
    </a>
  );
}

autocomplete({
  container: "#autocomplete",
  placeholder: "Search documentation",
  openOnFocus: true,
  getSources({ query }) {
    return [
      {
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: "autocomplete",
                query,
                params: {
                  hitsPerPage: 10
                }
              }
            ]
          });
        },
        templates: {
          item({ item }) {
            return AutocompleteItem({
              hit: item,
              breadcrumb: Object.values(item.hierarchy)
                .filter(Boolean)
                .slice(0, -1)
            });
          }
        }
      }
    ];
  }
});
```

The template displays the section name, found in the `item.hierachy` and a breadcrumb composed of the levels in `item.hierarchy`, except for the final level, which is the section name. The final level where the section name is found is given in `item.type`.

Try it out below:

<input placeholder="This is just a placeholder"></input>

That creates a basic implementation. To make it more useful, you can use the [`getItemUrl`](/docs/sources#getitemurl) to add [keyboard accessibility](keyboard-navigation) features. It lets users open items directly from the autocomplete menu.

```js title="JavaScript"
/** @jsx h */
import { autocomplete, getAlgoliaHits } from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import { h } from "preact";

const searchClient = algoliasearch(
  "BH4D9OD16A",
  "a5c3ccfd361b8bcb9708e679c43ae0e5"
);

function AutocompleteItem({ hit, breadcrumb }) {
  return (/* ... */);
}

autocomplete({
  container: "#autocomplete",
  placeholder: "Search documentation",
  openOnFocus: true,
  getSources({ query }) {
    return [
      {
        getItems() {
          /*...*/
        },
        templates: {
          /*...*/
        },
        getItemUrl({ item }) {
          return item.url;
        }
      }
    ];
  }
});
```
Now give it a try:

<input placeholder="This is just another placeholder"></input>

## Going further

This outlines a simple autocomplete implementation. There's a lot more you can do, like [adding multiple sources](/docs/creating-multi-source-autocompletes), using [templates for headers, footers](/docs/templates#rendering-a-header-and-footer), or when there's [no results](/docs/templates#rendering-an-empty-state). To learn about customization options, read the [**Core Concepts**](/docs/basic-options) or follow one of the [**Guides**](/docs/using-query-suggestions-plugin).
