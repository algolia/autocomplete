---
id: using-vue
title: Using Autocomplete with Vue
---

Learn how to embed Autocomplete into a Vue application.

You can integrate an Autocomplete instance into a Vue application using [Vue's Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api). Specifically you can instantiate an Autocomplete instance in the [`onMounted`](https://v3.vuejs.org/api/composition-api.html#lifecycle-hooks) lifecycle hook in the [`setup`](https://v3.vuejs.org/guide/composition-api-setup.html) function.

This example uses an [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) of [e-commerce products](https://github.com/algolia/datasets/tree/master/ecommerce) as a source. You could use any other source or sources you like.

## Prerequisites

This tutorial assumes that you have:
- an existing [Vue (v3) application](https://v3.vuejs.org/) where you want to implement the autocomplete menu
- familiarity with the [basic Autocomplete configuration options](basic-options)

:::note

Since [Vue's Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api) is available starting in Vue 3, you can only use this guide for Vue 3 applications.

:::

## Getting started

Begin by adding a container for your autocomplete menu. This example adds a `div` with `autocomplete` as an [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).

```html title="App.vue"
<template>
  <div className="app-container">
    <h1>Vue Application</h1>
    <div id="autocomplete" />
  </div>
</template>
```

Then, import the necessary packages for a basic implementation. Since the example queries an Algolia index, it imports the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) package and `autocomplete` and [`getAlgoliaHits`](getAlgoliaHits) from the [`autocomplete-js`](autocomplete-js) package. Depending on your desired [sources](sources) you may need to import other packages including [plugins](plugins).

Include some boilerplate to insert the autocomplete into:

```html title="App.vue"
<template>
  <div className="app-container">
    <h1>Application title</h1>
    <div id="autocomplete" />
  </div>
</template>

<script>
import { h, Fragment, render, onMounted } from "vue";
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

export default {
  name: "App",
};
</script>

```

## Adding an Algolia source

The [`autocomplete-js`](autocomplete-js) package provides a built-in [`getAlgoliaHits`](getAlgoliaHits) function for querying an Algolia index. It requires an [Algolia search client](https://www.algolia.com/doc/api-client/getting-started/install/javascript/) initialized with an [Algolia application ID and API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id). It lets you search into your Algolia index using an array of `queries`, which defines one or more queries to send to the index.

For more information how to use the [`getAlgoliaHits`](getAlgoliaHits) function, see the [Getting Started guide](getting-started).

## Mounting the autocomplete

You can instantiate and mount your Autocomplete instance in the [`onMounted`](https://v3.vuejs.org/api/composition-api.html#lifecycle-hooks) lifecycle hook in the [`setup`](https://v3.vuejs.org/guide/composition-api-setup.html) function. Doing so requires passing the `renderer` and `render` parameters.

This is because the default Autocomplete implementation uses [Preact's](https://preactjs.com/) version of `createElement`, `Fragment` and `render`. Without providing Vue's version of these, the Autocomplete instance won't render the views properly.

```html title="App.vue"
<template>
  <div className="container">
    <h1>Autocomplete with Vue</h1>
    <div id="autocomplete" />
  </div>
</template>

<script>
import { h, Fragment, render, onMounted } from "vue";
import algoliasearch from 'algoliasearch/lite';
import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

import "@algolia/autocomplete-theme-classic";

export default {
  name: "App",
  setup() {
    onMounted(() => {
      autocomplete({
        container: "#autocomplete",
        openOnFocus: true,
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
              // ...
            },
          ];
        },
        renderer: {
          createElement: h,
          Fragment,
        },
        render({ children }, root) {
          render(children, root);
        },
      });
    });
  },
};
</script>
```

## Customizing templates

Next, to display the results from Algolia, you need to define an [`item` template](templates). If you're using the highlighting and snippeting utilities, there's one thing to keep in mind: you must pass them Vue's `createElement` function. Without doing this, the utilities default to `preact.createElement` and won't work properly.

The highlighting and snippeting utilities are:
- [`highlightHit`](highlighthit)
- [`snippetHit`](snippethit)
- [`reverseHighlightHit`](reversehighlighthit)
- [`reverseSnippetHit`](reversesnippethit)

Here's an example of a custom `item` template using [`snippetHit`](snippethit):

```html title="App.vue"
<script>
import { h, Fragment, render, onMounted } from "vue";
import { autocomplete, snippetHit } from "@algolia/autocomplete-js";

export default {
  name: "App",
  setup() {
    onMounted(() => {
      autocomplete({
        // ...
        getSources({ query }) {
          return [
            {
              // ...
              templates: {
                item({ item }) {
                  return (
                    <Fragment>
                      <div className="aa-ItemIcon">
                        <img src={hit.image} alt={hit.name} width="40" height="40" />
                      </div>
                      <div className="aa-ItemContent">
                        <div className="aa-ItemContentTitle">
                          {snippetHit({
                            hit: item,
                            attribute: "name",
                            createElement: h,
                          })}
                        </div>
                        <div className="aa-ItemContentDescription">
                          {snippetHit({
                            hit: item,
                            attribute: "description",
                            createElement: h,
                          })}
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
                },
              },
            },
          ];
        },
        renderer: {
          createElement: h,
          Fragment,
        },
        render({ children }, root) {
          render(children, root);
        },
      });
    });
  },
};
</script>
```

Keep in mind that you should use JSX syntax for your templates.

## Further UI customization

If you want to build a custom UI that differs from the `autocomplete-js` output, check out the [guide on creating a custom renderer](creating-a-renderer). This guide outlines how to create a custom React renderer, but the underlying principles are the same for any other front-end framework.
