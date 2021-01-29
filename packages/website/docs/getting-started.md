---
id: getting-started
title: Getting Started
---

Get started with Autocomplete by building an Algolia search experience.

This documentation offers a few ways to learn about the Autocomplete library:
  - Read the [**Core Concepts**](basic-options) to learn more about underlying principles, like [**Sources**](sources) and [**State**](state).
  - Follow the [**Guides**](using-query-suggestions-plugin) to understand how to build common UX patterns.
  - Refer to [**API reference**](api) for a comprehensive list of parameters and options.
  - Try out the [**Playground**](https://codesandbox.io/s/github/algolia/autocomplete.js/tree/next/examples/js?file=/app.ts) where you can fork a basic implementation and play around.

Keep reading to see how to install Autocomplete and build a basic implementation with Algolia.

## Installation

The recommended way to get started is with the [`autocomplete-js`](autocomplete-js) package. It includes everything you need to render a JavaScript autocomplete experience.

Otherwise, you can install the [`autocomplete-core`](createAutocomplete) package if you want to [build a renderer](creating-a-renderer) from scratch.

All Autocomplete packages are available on the [npm](https://www.npmjs.com/) registry.

```bash
yarn add @algolia/autocomplete-js@alpha
# or
npm install @algolia/autocomplete-js@alpha
```

If you don't want to use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js@alpha"></script>
```

We recommend using jsDeliver but [`autocomplete-js`](autocomplete-js) is also available at:
- [CDNJS](https://cdnjs.com/libraries/autocomplete.js)
- [unpkg](https://unpkg.com/@algolia/autocomplete-js@1.0.0-alpha.39)


:::note

We don't provide support regarding third party services like jsDeliver or other CDNs.

:::


## Defining where to put your autocomplete

To get started, you need a container for your autocomplete to go in. If you don't have one already, you can insert one into your markup:

```js title="HTML"
<div id="autocomplete"></div>
```

Then, insert your autocomplete into it by calling the [`autocomplete`](autocomplete-js) function and providing the [`container`](autocomplete-js/#container). It can be a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement).

Make sure to provide a container (e.g., a `div`), not an `input`. Autocomplete generates a fully accessible search box for you.

```js title="JavaScript"
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search the autocomplete documentation',
  openOnFocus: true,
  getSources() {
    return [];
  },
});
```

You may have noticed three new options: [`placeholder`](autocomplete-js#placeholder), [`openOnFocus`](autocomplete-js#openonfocus), and [`getSources`](sources#getsources).

The [`placeholder`](autocomplete-js#placeholder) option defines the placeholder text to show until the user starts typing in the input, while the [`openOnFocus`](autocomplete-js#openonfocus) option determines whether to open the panel on [focus](https://developer.mozilla.org/en-US/docs/Web/API/Window/focus_event) or not, even when there's no query. It defaults to `false`, so you need to set it to `true` if you want the dropdown to appear as soon as a user clicks on it.

Autocomplete is now plugged in. But you won't see anything appear until you define your [sources](sources).

## Defining what items to display

[Sources](sources) define where to retrieve the items to display in your autocomplete dropdown. You define your sources in the [`getSources`](sources#getsources) function by returning an array of [source objects](sources#source). Each source object needs to include a [`getItems`](sources#getitems) function that returns the items to display. Sources can be static or dynamic.

This example uses the [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) that's [powering the documentation search](https://docsearch.algolia.com/) on this site as a source. The [`autocomplete-js`](autocomplete-js) library provides a built-in [`getAlgoliaHits`](getAlgoliaHits) function for just this purpose.

```js title="JavaScript"
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

const searchClient = algoliasearch(
  'BH4D9OD16A',
  'a5c3ccfd361b8bcb9708e679c43ae0e5'
);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search documentation',
  openOnFocus: true,
  getSources({ query }) {
    return [
      {
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'autocomplete',
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

This example makes just one query to the "autocomplete" index using the `query` from [`getSources`](sources#getsources). It passes one additional parameter, [`hitsPerPage`](https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/) to define how many items to display, but you could pass any other [Algolia query parameters](https://www.algolia.com/doc/api-reference/api-parameters/).

Although you've now declared what items display using [`getSources`](sources#getsources), you still won't see anything until you've defined _how_ to display the items you've retrieved.

## Defining how to display items

[Sources](sources) also define how to display items in your Autocomplete using [`templates`](templates).  Templates can return a string or anything that's a valid Virtual DOM element. The example creates a [Preact](https://preactjs.com/) component called `AutocompleteItem` as the template for each item to display.

```jsx title="JSX"
/** @jsx h */
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';

const searchClient = algoliasearch(
  'BH4D9OD16A',
  'a5c3ccfd361b8bcb9708e679c43ae0e5'
);

function AutocompleteItem({ hit, breadcrumb }) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">{hit.hierarchy[hit.type]}</div>
        <div className="aa-ItemContentSubtitle">{breadcrumb.join(' • ')}</div>
      </div>
    </a>
  );
}

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search documentation',
  openOnFocus: true,
  getSources({ query }) {
    return [
      {
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'autocomplete',
                query,
                params: {
                  hitsPerPage: 10,
                },
              },
            ],
          });
        },
        templates: {
          item({ item }) {
            return AutocompleteItem({
              hit: item,
              breadcrumb: Object.values(item.hierarchy)
                .filter(Boolean)
                .slice(0, -1),
            });
          },
        },
      },
    ];
  },
});
```

The template displays the section name from the deepest level of `item.hierachy`. Beneath that, it displays a breadcrumb from all the higher levels in `item.hierarchy`.

This is what the JSON record looks like:

```json title="JSON record"
{
  "hierarchy": {
    "lvl0": "The Basics",
    "lvl1": "Getting Started",
    "lvl2": "Defining how to display items",
    "lvl3": null,
    "lvl4": null,
    "lvl5": null,
    "lvl6": null
  },
  "type": "lvl2",
  "url": "https://autocomplete.algolia.com/docs/getting-started/"
}
```

Check out how the template displays items by searching in the input below:

<input placeholder="This is just a placeholder"></input>

This is all you need for a basic implementation. To go even further, you can use the [`getItemUrl`](sources#getitemurl) to add [keyboard accessibility](keyboard-navigation) features. It lets users open items directly from the autocomplete menu.

```jsx title="JSX"
/** @jsx h */
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';

const searchClient = algoliasearch(
  'BH4D9OD16A',
  'a5c3ccfd361b8bcb9708e679c43ae0e5'
);

function AutocompleteItem({ hit, breadcrumb }) {
  // ...
}

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search documentation',
  openOnFocus: true,
  getSources({ query }) {
    return [
      {
        getItems() {
          // ...
        },
        templates: {
          // ...
        },
        getItemUrl({ item }) {
          return item.url;
        },
      },
    ];
  },
});
```
Now give it a try:

<input placeholder="This is just another placeholder"></input>

## Going further

This outlines a basic autocomplete implementation. There's a lot more you can do, like [adding multiple sources](creating-multi-source-autocompletes), using [templates for headers, footers](templates#rendering-a-header-and-footer), or when there's [no results](templates#rendering-an-empty-state), or even add a [plugin](plugins). To learn about customization options, read the [**Core Concepts**](basic-options) or follow one of the [**Guides**](using-query-suggestions-plugin).
