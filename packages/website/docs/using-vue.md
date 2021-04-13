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
  <div class="app-container">
    <h1>Vue Application</h1>
    <div id="autocomplete" />
  </div>
</template>
```

Then, import the necessary packages for a basic implementation. Since the example queries an Algolia index, it imports the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) package, [`autocomplete`](autocomplete-js) and [`getAlgoliaHits`](getAlgoliaHits-js) from the [`autocomplete-js`](autocomplete-js) package. Finally, it imports [`autocomplete-theme-classic`](autocomplete-theme-classic) package for some out of the box styling.

Depending on your desired [sources](sources), you may need to import other packages including [plugins](plugins).

Include some boilerplate to insert the autocomplete into:

```html title="App.vue"
<template>
  <div class="app-container">
    <h1>Application title</h1>
    <div id="autocomplete" />
  </div>
</template>

<script>
  import { h, Fragment, render, onMounted } from 'vue';
  import algoliasearch from 'algoliasearch/lite';
  import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

  import '@algolia/autocomplete-theme-classic';

  export default {
    name: 'App',
  };
</script>
```

## Adding an Algolia source

The [`autocomplete-js`](autocomplete-js) package provides a built-in [`getAlgoliaHits`](getAlgoliaHits-js) function for querying an Algolia index. It requires an [Algolia search client](https://www.algolia.com/doc/api-client/getting-started/install/javascript/) initialized with an [Algolia application ID and API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id). It lets you search into your Algolia index using an array of `queries`, which defines one or more queries to send to the index.

For more information how to use the [`getAlgoliaHits`](getAlgoliaHits-js) function, see the [Getting Started guide](getting-started).

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
  import { h, Fragment, render, onMounted } from 'vue';
  import algoliasearch from 'algoliasearch/lite';
  import { autocomplete, getAlgoliaHits } from '@algolia/autocomplete-js';

  import '@algolia/autocomplete-theme-classic';

  export default {
    name: 'App',
    setup() {
      onMounted(() => {
        autocomplete({
          container: '#autocomplete',
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

Next, to display the results from Algolia, you need to define an [`item` template](templates).

```html title="App.vue"
<script>
  import { h, Fragment, render, onMounted } from 'vue';
  import { autocomplete } from '@algolia/autocomplete-js';

  export default {
    name: 'App',
    setup() {
      onMounted(() => {
        autocomplete({
          // ...
          getSources({ query }) {
            return [
              {
                // ...
                templates: {
                  item({ item, components }) {
                    return (
                      <div className="aa-ItemWrapper">
                        <div className="aa-ItemContent">
                          <div className="aa-ItemIcon">
                            <img
                              src={hit.image}
                              alt={hit.name}
                              width="40"
                              height="40"
                            />
                          </div>
                          <div className="aa-ItemContentBody">
                            <div className="aa-ItemContentTitle">
                              <components.Snippet hit={item} attribute="name" />
                            </div>
                            <div className="aa-ItemContentDescription">
                              <components.Snippet
                                hit={item}
                                attribute="description"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
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
