---
id: using-recent-searches-plugin
title: Using the Recent Searches plugin
---
import { AutocompleteExample } from '@site/src/components/AutocompleteExample';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

Learn how you can include recent searches using the Recent Searches plugin.

Most autocomplete menus include suggested searches. You can make the experience more user-friendly by adding recent searches a user has made. This UX lets users easily recall their past searches in case they want to search for them again.

## Prerequisites

This tutorial assumes that you have:
- existing markup containing an input element where you want to implement the autocomplete dropdown
- front-end development proficiency with HTML, CSS, and JavaScript

**Using this plugin doesn't require an Algolia application.** If you plan on including other sections in your autocomplete such as [Query Suggestions](using-query-suggestions-plugin), you _do_ need an [Algolia](https://www.algolia.com/) application with the Query Suggestions feature enabled.

To follow along with the tutorial, start with the markup and style sheets from the [complete example on GitHub](https://github.com/algolia/doc-code-samples/tree/autocomplete-v1/Autocomplete/multi-source). The tutorial includes code snippets of the JavaScript necessary to add recent searches.

## Getting started

First, begin with some boilerplate for the autocomplete implementation. Create a file called `index.js` in your `src` directory, and add the boilerplate below:

```js
import { autocomplete } from '@algolia/autocomplete-js';

// Instantiate the autocomplete instance
autocomplete({
  container: '#autocomplete',
  plugins: [],
  openOnFocus: true,
});
```

This boilerplate assumes you want to insert the autocomplete into a DOM element with `autocomplete` as an [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). You should change the [`container`](autocomplete-js/#container) to [match your markup](basic-options). Setting [`openOnFocus`](autocomplete-js/#openonfocus) to `true` ensures that the dropdown appears as soon as a user clicks on the input.

For now, `plugins` is an empty array, but you'll learn how to add the Recent Searches plugin next.

## Adding recent searches

The  Autocomplete library provides the `createLocalStorageRecentSearchesPlugin` function for creating a `recentSearchesPlugin`  out-of-the-box. To use it, you need to provide a `key` and `limit`.

The `key` can be any string and is useful to differentiate search histories if you have multiple autocompletes on one page. The `limit` defines the maximum number of recent searches to display.

```diff
import { autocomplete } from '@algolia/autocomplete-js';
+ import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
+
+ const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
+  key: 'RECENT_SEARCH',
+  limit: 5,
+});
+
// Instantiate the autocomplete instance
autocomplete({
  container: '#autocomplete',
-  plugins: [],
+  plugins: [recentSearchesPlugin],
  openOnFocus: true,
});
```

Since the `recentSearchesPlugin` reads from [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), you won't see any recent searches in your implementation until you've made some searches. To submit a search, be sure to press enter on the query. Once you do, you'll see it appear as a recent search. Try it out here:

<AutocompleteExample
  plugins={[recentSearchesPlugin]}
  openOnFocus={true}
/>

## Next steps

This tutorial focuses on creating and adding recent searches to an autocomplete menu. Most autocomplete menus include recent searches in addition to suggested searches and possibly other items. You can find an example including [Query Suggestions](using-query-suggestions-plugin), [static predefined items](sources#using-static-sources) on [GitHub](https://github.com/algolia/doc-code-samples/tree/autocomplete-v1/Autocomplete/multi-source).  To learn how to display multiple sections in one autocomplete, read the [guide on creating multi-source autocompletes](creating-multi-source-autocompletes).

