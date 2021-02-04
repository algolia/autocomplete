---
id: adding-suggested-searches
title: Adding suggested searches
---
import { AutocompleteExample } from '@site/src/components/AutocompleteExample';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import algoliasearch from 'algoliasearch/lite';
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});

Learn how to include suggested searches using the Query Suggestions plugin.

:::note

Using this plugin requires an [Algolia](https://www.algolia.com/) application with the [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) feature enabled.

:::

The most common autocomplete UX is one that displays a list of possible queries, or "query suggestions," that your users can select from as they type. **Query Suggestions help users find queries that are guaranteed to return results.** They help users type less and find what they are looking for faster.

The term “Query Suggestions” refers to the textual suggestions themselves. Query Suggestions are different from search results. Query Suggestions are only suggestions of better queries. When typing “smartphone”, a user may receive a suggestion to pick a more precise query, such as “smartphone apple” or “smartphone iphone xs”, which would retrieve more specific results.

[Algolia](https://www.algolia.com/) provides a [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) feature that generates suggestions [based on your what your users are searching for and the results within your dataset](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/#how-query-suggestions-works). This tutorial explains how to integrate [Algolia Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) into an autocomplete menu using the [`autocomplete-plugin-query-suggestions`](createQuerySuggestionsPlugin) package.

## Prerequisites

This tutorial assumes that you have:
- a populated [Query Suggestions index](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/creating-a-query-suggestions-index/js/)
- existing markup containing an input element where you want to implement the autocomplete dropdown
- front-end development proficiency with HTML, CSS, and JavaScript

:::note

If you don't have a Query Suggestions index yet, follow the guide on [creating a Query Suggestions index](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/creating-a-query-suggestions-index/js/). For learning purposes, you can use the demo application credentials and index name provided in this tutorial.

:::

## Getting started

First, begin with some boilerplate for the autocomplete implementation. Create a file called `index.js` in your `src` directory, and add the boilerplate below:

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  container: '#autocomplete',
  plugins: [],
  openOnFocus: true,
});
```

This boilerplate assumes you want to insert the autocomplete into a DOM element with `autocomplete` as an [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). You should change the [`container`](autocomplete-js/#container) to [match your markup](basic-options). Setting [`openOnFocus`](autocomplete-js/#openonfocus) to `true` ensures that the dropdown appears as soon as a user focuses the input.

For now, `plugins` is an empty array, but you'll learn how to add the Query Suggestions [plugin](plugins) next.

## Adding Query Suggestions

The [`autocomplete-plugin-query-suggestions`](createQuerySuggestionsPlugin) package provides the [`createQuerySuggestionsPlugin`](createQuerySuggestionsPlugin) function for creating a Query Suggestions [plugin](plugins) out-of-the-box.

It requires an [Algolia search client](https://www.algolia.com/doc/api-client/getting-started/install/javascript/) initialized with an [Algolia application ID and API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id) and an `indexName`. The `indexName` is the name of your [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) index.

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});

autocomplete({
  container: '#autocomplete',
  plugins: [querySuggestionsPlugin],
  openOnFocus: true,
});
```

You can optionally pass a `getSearchParams` function to apply [Algolia query parameters](https://www.algolia.com/doc/api-reference/api-parameters/) to the suggestions returned from the plugin.

For example, you may choose to display ten Query Suggestions if the user hasn't typed anything yet, but only five if they have:

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams({ state }) {
    return { hitsPerPage: state.query ? 5 : 10 };
  },
});

autocomplete({
  container: '#autocomplete',
  plugins: [querySuggestionsPlugin],
  openOnFocus: true,
});
```
This option can be especially useful if you are [displaying other sources](adding-multiple-categories) along with Query Suggestions and want to always show the same total number of items.

This creates a basic Query Suggestions implementation. Try it out below:

<AutocompleteExample
  plugins={[querySuggestionsPlugin]}
  openOnFocus={true}
/>

:::note

These suggestions are based on a [public dataset of BestBuy products](https://github.com/algolia/datasets/tree/master/ecommerce).

:::

## Next steps

This tutorial focuses on adding Query Suggestions to an autocomplete menu. Many autocomplete menus also include recent searches and possibly other items. Check out the guides on adding [recent searches](adding-recent-searches) and [static predefined items](sources#using-static-sources) for more information. To learn how to display multiple sections in one autocomplete, read the [guide on creating multi-source autocompletes](adding-multiple-categories).

