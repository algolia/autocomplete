---
id: using-query-suggestions-plugin
title: Using the Query Suggestions plugin
---

Learn how to include suggested searches using the Query Suggestions plugin.

The most common autocomplete UX is one that displays a list of possible queries, or "query suggestions," that your users can select from as they type.  **Query Suggestions help users find queries that are guaranteed to return results.** They help users type less, and find what they are looking for faster.

The term “query suggestions” refers to the textual suggestions themselves. Query Suggestions are different from search results. Query Suggestions are only suggestions of better queries. When typing “smartphone”, a user may receive a suggestion to pick a more precise query, such as “smartphone apple” or “smartphone iphone xs”, which would retrieve more specific results.

[Algolia](https://www.algolia.com/) provides a [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) feature that generates suggestions [based on your what your users are searching for and the results within your dataset](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/#how-query-suggestions-works).

This tutorial explains how to integrate [Algolia Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) into an autocomplete menu using the [`createQuerySuggestionsPlugin`](createQuerySuggestionsPlugin).

## Prerequisites

:::note

Using this plugin requires an [Algolia](https://www.algolia.com/) application with the [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) feature enabled.

:::

This tutorial assumes that you have:
- a populated [Query Suggestions index](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/creating-a-query-suggestions-index/js/)
- existing markup containing an input element where you want to implement the autocomplete dropdown
- front-end development proficiency with HTML, CSS, and JavaScript

To follow along with the tutorial, start with the markup and style sheets from the [complete example on GitHub](https://github.com/algolia/doc-code-samples/tree/autocomplete-v1/Autocomplete/multi-source). The tutorial includes code snippets of the JavaScript necessary to add Query Suggestions.

## Getting started

First, begin with some boilerplate for the autocomplete implementation: create a file called `index.js` in your `src` directory, and add the boilerplate below:

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

For now, `plugins` is an empty array, but you'll learn how to add the Query Suggestions plugin next.

## Adding Query Suggestions

The  Autocomplete library provides the [`createQuerySuggestionsPlugin`](createQuerySuggestionsPlugin) function for creating a `querySuggestions` plugin out-of-the-box.

It requires an [Algolia search client](https://www.algolia.com/doc/api-client/getting-started/install/javascript/) initialized with an [Algolia application ID and API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id) and an `indexName`. The `indexName` is the name of your [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) index. **You must have a populated [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/#implementing-query-suggestions) index to use this plugin.**

```diff
import { autocomplete } from '@algolia/autocomplete-js';
+ import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
+
+ const searchClient = algoliasearch(
+   'yourAppID',
+   'yourSearchApiKey'
+ );
+
+ const querySuggestionsPlugin = createQuerySuggestionsPlugin({
+   searchClient,
+   indexName: 'yourQuerySuggestionsIndexName',
+   },
+ });
+
autocomplete({
  container: '#autocomplete',
-  plugins: [],
+  plugins: [querySuggestionsPlugin],
  openOnFocus: true,
});
```

You can optionally pass a `getSearchParams` function to apply [Algolia query parameters](https://www.algolia.com/doc/api-reference/api-parameters/) to the suggestions returned from the plugin. This is particularly useful if you need to align your Query Suggestions with other sections displayed in the autocomplete, like [recent searches](using-recent-searches-plugin).

```diff
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const searchClient = algoliasearch(
  'yourAppID',
  'yourSearchApiKey'
);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'yourQuerySuggestionsIndexName',
+ getSearchParams() {
+   return recentSearchesPlugin.data.getAlgoliaSearchParams({
+     hitsPerPage: 5,
+   });
  },
});

autocomplete({
  container: '#autocomplete',
  plugins: [querySuggestionsPlugin],
  openOnFocus: true,
});
```
This creates a basic Query Suggestions implementation. Try it out below:

<input placeholder="This is a placholder for a Query Suggestions autocomplete"></input>

## Next steps

This tutorial focuses on adding Query Suggestions to an autocomplete menu. Many autocomplete menus also include recent searches and possibly other items. You can find an example including [recent searches](using-recent-searches-plugin) and [static predefined items](sources#using-static-sources) on [GitHub](https://github.com/algolia/doc-code-samples/tree/autocomplete-v1/Autocomplete/multi-source). To learn how to display multiple sections in one autocomplete, read the [guide on creating multi-source autocompletes](creating-multi-source-autocompletes).


