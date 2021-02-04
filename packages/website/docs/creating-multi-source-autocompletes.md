---
id: adding-multiple-categories
title: Adding mulitple categories
---
import { AutocompleteExample } from '@site/src/components/AutocompleteExample';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import algoliasearch from 'algoliasearch/lite';
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'yourQuerySuggestionsIndexName',
  getSearchParams() {
    return recentSearchesPlugin.data.getAlgoliaSearchParams({
      hitsPerPage: 5,
    });
  },
});
const predefinedItems = [
  {
    label: 'Documentation',
    url: 'https://autocomplete.algolia.com/',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/algolia/autocomplete.js/tree/next',
  },
]
const predefinedItemsPlugin = {
  getSources() {
    return [
      {
        getItems({ query }) {
          return predefinedItems.filter(
            (item) =>
              !query || item.label.toLowerCase().includes(query.toLowerCase())
          );
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          item({ item}) {
              return (
                <a href={item.url} className="aa-ItemContent aa-ItemLink aa-PredefinedItem">
                  <div className="aa-ItemSourceIcon">
                    <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                       <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                     </svg>
                  </div>
                  <div className="'aa-ItemTitle">{item.label}</div>
                </a>
              )
        },
        },
      },
    ];
  },
};

Learn how to show different types of results in one autocomplete.

:::note

Following this tutorial requires an [Algolia](https://www.algolia.com/) application with the [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) feature enabled.

:::

While autocompletes with [suggested searches](adding-suggested-searches) is a ubiquitous search experience, rich multi-category autocompletes are becoming more and more popular.

For example, if you search for something in your email inbox, your results could contain not just email threads, but also contacts, attachments, and more. Ecommerce stores often show suggested searches, products, blog posts, brands, and categories all in one autocomplete.

It's best to display different results types in different sections. This implicitly gives users a better understanding of what the items are, and what will happen if they select an item.

The Autocomplete library lets you mix different item types in one autocomplete and customize their display. To do so you need to return multiple [sources](sources#source) in the  [`getSources`](sources) option. This tutorial outlines how to combine [static predefined items](sources/#using-static-sources), [recent searches](adding-recent-searches)] and [Query Suggestions](adding-suggested-searches) in one autocomplete.

Though it's not necessary, it uses [plugins](plugins) for each [source](source). Instead, you could add different sources directly in [`getSources`](sources). However, it's recommend to encapsulate [source](sources) logic in a plugin since this makes it modular, reusable, and sharable.

## Prerequisites

This tutorial assumes that you have:
- a populated [Query Suggestions Algolia index](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/creating-a-query-suggestions-index/js/) (or you can use the demo application credentials)
- existing markup containing an input element where you want to implement the autocomplete dropdown
- front-end development proficiency with HTML, CSS, and JavaScript

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

For now, `plugins` is an empty array, but you'll learn how to create and add [plugins](plugins) for predefined items, recent searches, and Query Suggestions next.

## Adding predefined items

A popular search pattern for autocomplete menus shows predefined search terms as soon as a user clicks on the search bar and before they begin typing anything. This UX provides a guided experience and exposes users to helpful resources or other content you want them to see.

This tutorial describes how to create a [plugin](plugins) to show static, predefined items. In particular, it exposes helpful links the user may want to refer to.

### Creating a predefined items plugin

Begin by creating a `predefinedItemsPlugin.js` file in your `src` directory, with the following code:

```js title="predefinedItemsPlugin.js"
const predefinedItems = [
  {
    label: 'Documentation',
    url: 'https://autocomplete.algolia.com/',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/algolia/autocomplete.js/tree/next',
  },
]

export const predefinedItemsPlugin = {
  getSources() {
    return [
      {
        getItems({ query }) {
          if (!query) {
            return predefinedItems;
          }

          return predefinedItems.filter(
            (item) =>
              item.label.toLowerCase().includes(query.toLowerCase())
          );
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          // ...
        },
      },
    ];
  },
};

```

Notice that `predefinedItemsPlugin` has a similar signature as any other autocomplete implementation: it uses the [`getSources`](autocomplete-js/#getsources) option to return an array of items to display. Each object in the array defines where to get items using [`getItems`](sources/#getitems). An Autocomplete plugin is an object that implements the `AutocompletePlugin` interface. To learn more, check out the documentation on [building your own plugin](plugins#building-your-own-plugin).

In this example, [`getItems`](sources/#getitems) returns a filtered array of `predefinedItems`. The code filters the array to return items that match the query, if it exists. If it doesn't, it returns the entire array. **You can return whatever predefined items you like and format them accordingly.** For example, suppose you want to show trending search items instead of helpful links. Then, you can use [`getItems`](sources/#getitems) to retrieve them from another source, [including an asynchronous API](sources#using-dynamic-sources).

The [`getItemUrl`](sources/#getitemurl) function defines how to get the URL of an item. In this case, since it's an attribute on each object in the `predefinedItems` array, you can simply return the attribute. You can use [`getItemUrl`](sources/#getitemurl) to add [keyboard navigation](keyboard-navigation) to the autocomplete menu. Users can scroll through items in the autocomplete menu with the arrow up and down keys. When they hit <kbd>Enter</kbd> on one of the `predefinedItems` (or any source that includes[`getItemUrl`](sources/#getitemurl)), it opens the URL retrieved from [`getItemUrl`](sources/#getitemurl).

[Templates](templates) define how to display each section of the autocomplete, including the [`header`](templates#header), [`footer`](templates#footer), and each [`item`](templates#item). You can provide either a string, or as the example below shows, a function for how to manipulate the DOM.

```js title="predefinedItemsPlugin.js"
  const predefinedItems = [
  {
    label: 'Documentation',
    url: 'https://autocomplete.algolia.com/',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/algolia/autocomplete.js/tree/next',
  },
]
export const predefinedItemsPlugin = {
  getSources() {
    return [
      {
        getItems({ query }) {
          return predefinedItems.filter(
            (item) =>
              !query || item.label.toLowerCase().includes(query.toLowerCase())
          );
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          item({ item}) {
              return (
                <a href={item.url} className="aa-ItemContent aa-PredefinedItem">
                  <div className="aa-ItemSourceIcon">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                       <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                     </svg>
                  </div>
                  <div className="'aa-ItemTitle">{item.label}</div>
                </a>
              )
          },
        },
      },
    ];
  },
};
```

### Adding the predefined items plugin to the autocomplete

All that's left is to import the newly created `predefinedItemsPlugin` and add it to`plugins` in `index.js`. Once you've done that, the file should look like this:

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { predefinedItemsPlugin } from './predefinedItemsPlugin';

autocomplete({
  container: '#autocomplete',
  plugins: [predefinedItemsPlugin],
  openOnFocus: true,
});
```

Now, as soon as a user clicks on the search bar, these predefined items appear. Once they begin typing, only predefined items that contain the query remain.

<AutocompleteExample
  plugins={[predefinedItemsPlugin]}
  openOnFocus={true}
/>

## Adding recent searches and Query Suggestions

You can add recent searches and Query Suggestions using out-of-the-box plugins. Refer to the guides on [adding recent searches](adding-recent-searches) and [Query Suggestions](adding-suggested-searches) for more detailed explanations.

### Creating a recent searches plugin

Use the out-of-the-box [`createLocalStorageRecentSearchesPlugin`](createlocalstoragerecentsearchesplugin) function to create a recent searches plugin:

```js title="JavaScript"
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

```

The `key` can be any string and is required to differentiate search histories if you have multiple autocompletes on one page. The `limit` defines the maximum number of recent searches to display.

### Creating a Query Suggestions plugin

:::note

If you don't have a Query Suggestions index yet, follow the guide on [creating a Query Suggestions index](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/how-to/creating-a-query-suggestions-index/js/). You can also use the demo application credentials and index name provided in this tutorial.

:::

Use the out-of-the-box [`createQuerySuggestionsPlugin`](createQuerySuggestionsPlugin) function to create a Query Suggestions plugin. It requires an [Algolia search client](https://www.algolia.com/doc/api-client/getting-started/install/javascript/) initialized with an [Algolia application ID and API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id) and an `indexName`. The `indexName` is the name of your [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) index.

```js title="Javascript"
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});
```

### Aligning Query Suggestions to items from different sources

When instantiating your Query Suggestions plugin, you can optionally pass a [`getSearchParams`](createquerysuggestionsplugin/#getsearchparams) function to apply [Algolia query parameters](https://www.algolia.com/doc/api-reference/api-parameters/) to the suggestions returned from the plugin. This is particularly useful if you need to align your Query Suggestions with other sections displayed in the autocomplete, like [recent searches](adding-recent-searches).

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
  return recentSearchesPlugin.data.getAlgoliaSearchParams({
    hitsPerPage: 5,
  });
  },
});

autocomplete({
  // ...
});
```

## Putting it all together

All that's left to do is add all of your plugins to your autocomplete instance:

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { predefinedItemsPlugin } from './predefinedItemsPlugin';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    return recentSearchesPlugin.data.getAlgoliaSearchParams({
      hitsPerPage: 5,
    });
  },
});

autocomplete({
  container: '#autocomplete',
  plugins: [predefinedItemsPlugin, recentSearchesPlugin, querySuggestionsPlugin],
  openOnFocus: true,
});
```

This creates a basic multi-source autocomplete. Try it out below:

<AutocompleteExample
  plugins={[predefinedItemsPlugin, recentSearchesPlugin, querySuggestionsPlugin]}
  openOnFocus={true}
/>

## Next steps

This tutorial combined three sources in one autocomplete. Depending on your use case, you might want to add more or different ones than the ones included here. Regardless of what you use for your sources, the method is the same. You may also choose to style your multi-source autocomplete differently by creating a horizontal layout or further differentiating how to display each source type.
