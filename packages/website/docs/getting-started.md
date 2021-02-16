---
id: getting-started
title: Getting Started
---
import { AutocompleteExample } from '@site/src/components/AutocompleteExample';
import { ProductItem } from '@site/src/components/ProductItem';
import { getAlgoliaHits } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

Get started with Autocomplete by building an Algolia search experience.

This documentation offers a few ways to learn about the Autocomplete library:
  - Read the [**Core Concepts**](basic-options) to learn more about underlying principles, like [**Sources**](sources) and [**State**](state).
  - Follow the [**Guides**](adding-suggested-searches) to understand how to build common UX patterns.
  - Refer to [**API reference**](api) for a comprehensive list of parameters and options.
  - Try out the [**Playground**](https://codesandbox.io/s/github/algolia/autocomplete.js/tree/next/examples/js?file=/app.tsx) where you can fork a basic implementation and play around.

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

We recommend using [jsDelivr](https://www.jsdelivr.com) but [`autocomplete-js`](autocomplete-js) is also available through [unpkg](https://unpkg.com/@algolia/autocomplete-js@alpha).

### Installing the Autocomplete Classic Theme

The Autocomplete library provides the [`autocomplete-theme-classic`](autocomplete-theme-classic) package so that you can have sleek styling out of the box.

If you want a custom theme, you can use this classic theme and customize it with CSS variables. You can also create a new theme entirely using the classic theme as a starting point.

This example uses the out of the box classic theme. You can import it like any other Autocomplete package.

```bash
yarn add @algolia/autocomplete-theme-classic@alpha
# or
npm install @algolia/autocomplete-theme-classic@alpha
```

If you don't want to use a package manager, you can add it as a stylesheet in your markup:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-theme-classic@alpha"
/>
```

:::note

We don't provide support regarding third party services like jsDeliver or other CDNs.

:::

## Defining where to put your autocomplete

To get started, you need a container for your autocomplete to go in. If you don't have one already, you can insert one into your markup:

```js title="index.html"
<div id="autocomplete"></div>
```

Then, insert your autocomplete into it by calling the [`autocomplete`](autocomplete-js) function and providing the [`container`](autocomplete-js/#container). It can be a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement).

Make sure to provide a container (e.g., a `div`), not an `input`. Autocomplete generates a fully accessible search box for you.

```js title="app.js"
import { autocomplete } from '@algolia/autocomplete-js';

import '@algolia/autocomplete-theme-classic';

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for products',
  getSources() {
    return [];
  },
});
```

You may have noticed two new options: [`placeholder`](autocomplete-js#placeholder) and [`getSources`](sources#getsources). The [`placeholder`](autocomplete-js#placeholder) option defines the placeholder text to show until the user starts typing in the input.

Autocomplete is now plugged in. But you won't see anything appear until you define your [sources](sources).

## Defining what items to display

[Sources](sources) define where to retrieve the items to display in your autocomplete dropdown. You define your sources in the [`getSources`](sources#getsources) function by returning an array of [source objects](sources#source).

Each source object needs to include a [`sourceId`](sources/#sourceid) and a [`getItems`](sources#getitems) function that returns the items to display. Sources can be static or dynamic.

This example uses the [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) of [e-commerce products](https://github.com/algolia/datasets/tree/master/ecommerce) as a source. The [`autocomplete-js`](autocomplete-js) package provides a built-in [`getAlgoliaHits`](getAlgoliaHits) function for just this purpose.

```js title="app.js"
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for products',
  getSources({ query }) {
    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  hitsPerPage: 10
                }
              }
            ]
          });
        },
        // ...
      }
    ];
  }
});
```

The [`getAlgoliaHits`](getAlgoliaHits) function requires an [Algolia search client](https://www.algolia.com/doc/api-client/getting-started/install/javascript/) initialized with an [Algolia application ID and API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id). It lets you search into your Algolia index using an array of `queries`, which defines one or more queries to send to the index.

This example makes just one query to the "autocomplete" index using the `query` from [`getSources`](sources#getsources). For now, it passes one additional parameter, [`hitsPerPage`](https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/) to define how many items to display, but you could pass any other [Algolia query parameters](https://www.algolia.com/doc/api-reference/api-parameters/).

Although you've now declared what items to display using [`getSources`](sources#getsources), you still won't see anything until you've defined _how_ to display the items you've retrieved.

## Defining how to display items

[Sources](sources) also define how to display items in your Autocomplete using [`templates`](templates). Templates can return a string or anything that's a valid Virtual DOM element. The example creates a [Preact](https://preactjs.com/) component called `ProductItem` to use as the template for each item.

The given `classNames` correspond to the [classic theme](autocomplete-theme-classic) imported earlier.

```jsx title="app.jsx"
/** @jsx h */
import { autocomplete, getAlgoliaHits, snippetHit } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import { h, Fragment } from 'preact';

import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for products',
  getSources({ query }) {
        return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  hitsPerPage: 10,
                  attributesToSnippet: ['name:10', 'description:35'],
                  snippetEllipsisText: '…',
                },
              },
            ],
          });
        },
        templates: {
          item({ item }) {
            return (
              <ProductItem
                hit={item}
              />
            );
          },
        },
      },
    ];
  },
});

function ProductItem({ hit }) {
  return (
    <Fragment>
      <div className="aa-ItemIcon">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {snippetHit<ProductHit>({ hit, attribute: 'name' })}
        </div>
        <div className="aa-ItemContentDescription">
          {snippetHit<ProductHit>({ hit, attribute: 'description' })}
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-TouchOnly aa-ActiveOnly"
          type="button"
          title="Select"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
        <button
          className="aa-ItemActionButton"
          type="button"
          title="Add to cart"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 5h-14l1.5-2h11zM21.794 5.392l-2.994-3.992c-0.196-0.261-0.494-0.399-0.8-0.4h-12c-0.326 0-0.616 0.156-0.8 0.4l-2.994 3.992c-0.043 0.056-0.081 0.117-0.111 0.182-0.065 0.137-0.096 0.283-0.095 0.426v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.219-0.071-0.422-0.189-0.585-0.004-0.005-0.007-0.010-0.011-0.015zM4 7h16v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707zM15 10c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121c0-0.552-0.448-1-1-1s-1 0.448-1 1c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
          </svg>
        </button>
      </div>
    </Fragment>
  );
}
```

The `ProductItem` component uses the [`snippetHit`](snippetHit) function to only display part of the item's name and description, if they go beyond a certain length. Each attribute's allowed length and the characters to show when truncated are defined in the [`attributesToSnippet`](https://www.algolia.com/doc/api-reference/api-parameters/attributesToSnippet/) and [`snippetEllipsisText`](https://www.algolia.com/doc/api-reference/api-parameters/snippetEllipsisText/) [Algolia query parameters](https://www.algolia.com/doc/api-reference/api-parameters/) in `params`.

This is what the truncated JSON record looks like:

```json title="JSON record"
{
  "name": "Apple - MacBook Air® (Latest Model) - 13.3\" Display - Intel Core i5 - 4GB Memory - 128GB Flash Storage - Silver",
  "description": "MacBook Air features fifth-generation Intel Core processors with stunning graphics, all-day battery life*, ultrafast flash storage, and great built-in apps. It's thin, light and durable enough to take everywhere you go &#8212; and powerful enough to do everything once you get there.",
  "image": "https://cdn-demo.algolia.com/bestbuy/1581921_sb.jpg",
  "url": "http://www.bestbuy.com/site/apple-macbook-air-latest-model-13-3-display-intel-core-i5-4gb-memory-128gb-flash-storage-silver/1581921.p?id=1219056464137&skuId=1581921&cmp=RMX&ky=1uWSHMdQqBeVJB9cXgEke60s5EjfS6M1W",
  "objectID": "1581921"
}
```

Check out how the template displays items by searching in the input below:

<AutocompleteExample
  getSources={({ query }) => {
    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  hitsPerPage: 5
                }
              }
            ]
          });
        },
        templates: {
          item({ item }) {
            return (
              <ProductItem
                hit={item}
              />
            );
          },
        },
      },
    ];
  }}
/>

## Going further

This is all you need for a basic implementation. To go further, you can use the [`getItemUrl`](sources#getitemurl) to add [keyboard accessibility](keyboard-navigation) features. It lets users open items directly from the autocomplete menu.

```jsx title="app.jsx"
/** @jsx h */
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch';
import { h } from 'preact';

import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for products',
  getSources({ query }) {
        return [
      {
        sourceId: 'products',
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

function ProductItem({ hit, breadcrumb }) {
  // ...
}
```
Now give it a try: navigate to one of the items using your keyboard and hit <kbd>Enter</kbd>. This brings you to the product detail page on [bestbuy.com](https://www.bestbuy.com/).

<AutocompleteExample
  getSources={({ query }) => {
    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  hitsPerPage: 5
                }
              }
            ]
          });
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          item({ item }) {
            return (
              <ProductItem
                hit={item}
              />
            );
          },
        },
      },
    ];
  }}
/>


This outlines a basic autocomplete implementation. There's a lot more you can do like:
-  define [templates for headers, footers](templates#rendering-a-header-and-footer), or when there's [no results](templates#rendering-an-empty-state)
- [add multiple sources](creating-multi-source-autocompletes), including [suggested searches](using-query-suggestions-plugin) and [recent searches](using-recent-searches-plugin)
- [send Algolia Insights events](using-algolia-insights-plugin) when a user clicks on an item or adds it to their cart

To learn about customization options, read the [**Core Concepts**](basic-options) or follow one of the [**Guides**](using-query-suggestions-plugin).
