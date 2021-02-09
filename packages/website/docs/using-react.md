---
id: using-react
title: Using Autocomplete with React
---

Learn how to embed Autocomplete into a React application.

This guide shows how to embed an autocomplete with [recent searches](adding-recent-searches) into a React application. Though it uses the [recent searches plugin](adding-recent-searches) for the [source](sources) of items, you could use any other source or sources you like.

## Prerequisites

This tutorial assumes that you have:
- an existing [React application](https://reactjs.org/docs/getting-started.html) where you want to implement the autocomplete dropdown
- familiarity with the [basic Autocomplete configuration options](basic-options)

## Getting started

Begin by adding a container for your autocomplete menu. This example adds a `div` with `autocomplete` as an [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).

```js
```

Then, import the necessary packages for a basic implementation. Since the example displays only recent searches, it imports the [`createLocalStorageRecentSearchesPlugin`](createlocalstoragerecentsearchesplugin) function from the [`autocomplete-plugin-recent-searches`](createlocalstoragerecentsearchesplugin) package. Depending on your desired [sources](sources) you may need to import other plugins and packages.

Include some boilerplate to insert the autocomplete into:

```js
```

## Adding recent searches

The  Autocomplete library provides the [`createLocalStorageRecentSearchesPlugin`](createlocalstoragerecentsearchesplugin) function for creating a recent searches [plugin](plugins) out-of-the-box. To use it, you need to provide a `key` and `limit`.

The `key` can be any string and is required to differentiate search histories if you have multiple autocompletes on one page. The `limit` defines the maximum number of recent searches to display.

```js
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});
```

## Mounting the autocomplete

Now that your [source](sources) is ready, you can instantiate and mount your autocomplete instance.

```js
```

## Customizing templates

This guide uses the recent searches plugin, which takes care of the display [templates](templates).

## Further UI customization

If you want to build a custom UI that differs from the `autocomplete-js` output, check out the [guide on creating a custom renderer](creating-a-renderer). This guide outlines how to create a custom React renderer, but the underlying principles are the same for any other front-end framework.
