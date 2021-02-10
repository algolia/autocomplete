---
id: using-vue
title: Using Autocomplete with Vue
---

Learn how to embed Autocomplete into a Vue application.

You can integrate an Autocomplete instance into a Vue application using [Vue's Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html#why-composition-api). Specifically you can instantiate an Autocomplete instance in the [`onMounted`](https://v3.vuejs.org/api/composition-api.html#lifecycle-hooks) lifecycle hook in the [`setup`](https://v3.vuejs.org/guide/composition-api-setup.html) function.

This guide shows how to embed an autocomplete with [recent searches](adding-recent-searches) into a Vue application. Though it uses the [recent searches plugin](adding-recent-searches) for the [source](sources) of items, you could use any other source or sources you like.

## Prerequisites

This tutorial assumes that you have:
- an existing [Vue (v3) application](https://v3.vuejs.org/) where you want to implement the autocomplete menu
- familiarity with the [basic Autocomplete configuration options](basic-options)

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

Then, import the necessary packages for a basic implementation. Since the example displays only recent searches, it imports the [`createLocalStorageRecentSearchesPlugin`](createlocalstoragerecentsearchesplugin) function from the [`autocomplete-plugin-recent-searches`](createlocalstoragerecentsearchesplugin) package. Depending on your desired [sources](sources) you may need to import other plugins and packages.

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
import { autocomplete } from "@algolia/autocomplete-js";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";

export default {
  name: "App",
};
</script>

```

## Adding recent searches

The  Autocomplete library provides the [`createLocalStorageRecentSearchesPlugin`](createlocalstoragerecentsearchesplugin) function for creating a recent searches [plugin](plugins) out-of-the-box. To use it, you need to provide a `key` and `limit`.

The `key` can be any string and is required to differentiate search histories if you have multiple autocompletes on one page. The `limit` defines the maximum number of recent searches to display.

```html title="App.vue"
<template>
  <div className="app-container">
    <h1>Application title</h1>
    <div id="autocomplete" />
  </div>
</template>

<script>
import { h, Fragment, render, onMounted } from "vue";
import { autocomplete } from "@algolia/autocomplete-js";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

export default {
  name: "App",
};
</script>

```

## Mounting the autocomplete

Now that your [source](sources) is ready, you can instantiate and mount your Autocomplete instance. Doing so requires passing the `renderer` and `render` parameters.

```html title="App.vue"
<template>
  <div className="container">
    <h1>Autocomplete with Vue</h1>
    <div id="autocomplete" />
  </div>
</template>

<script>
import { h, Fragment, render, onMounted } from "vue";
import { autocomplete } from "@algolia/autocomplete-js";
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";

import "@algolia/autocomplete-theme-classic";

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: "search",
  limit: 3,
});

export default {
  name: "App",
  setup() {
    onMounted(() => {
      autocomplete({
        container: "#autocomplete",
        openOnFocus: true,
        plugins: [recentSearchesPlugin],
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

This guide uses the recent searches plugin, which takes care of the display [templates](templates). If you want to define your own templates there are two things to keep in mind:
- You must use Vue JSX syntax.
- If you're using the highlighting and snippeting utilities ([`snippetHit`](snippethit) and [`highlightHit`](highlighthit)), you must pass them `createElement`.

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

## Further UI customization

If you want to build a custom UI that differs from the `autocomplete-js` output, check out the [guide on creating a custom renderer](creating-a-renderer). This guide outlines how to create a custom React renderer, but the underlying principles are the same for any other front-end framework.
