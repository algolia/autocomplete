---
id: adding-recent-searches
title: Adding recent searches
---
import { AutocompleteExample } from '@site/src/components/AutocompleteExample';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

Learn how to include recent searches using the Recent Searches plugin.

Most autocomplete menus include [suggested searches](adding-suggested-searches). You can make the experience more user-friendly by adding *recent searches* a user has made. This UX lets users easily recall their past searches in case they want to search for them again.

## Prerequisites

This tutorial assumes that you have:
- existing markup containing an input element where you want to implement the autocomplete dropdown
- front-end development proficiency with HTML, CSS, and JavaScript

**Using this plugin doesn't require an Algolia application.** If you plan on including other sections in your autocomplete such as [suggested searches](adding-suggested-searches), you _do_ need an [Algolia](https://www.algolia.com/) application with the [Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) feature enabled.

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

For now, `plugins` is an empty array, but you'll learn how to add the Recent Searches [plugin](plugins) next.

## Adding recent searches

The  Autocomplete library provides the [`createLocalStorageRecentSearchesPlugin`](createlocalstoragerecentsearchesplugin) function for creating a recent searches [plugin](plugins) out-of-the-box. To use it, you need to provide a `key` and `limit`.

The `key` can be any string and is required to differentiate search histories if you have multiple autocompletes on one page. The `limit` defines the maximum number of recent searches to display.

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'RECENT_SEARCH',
  limit: 5,
});

autocomplete({
  container: '#autocomplete',
  plugins: [recentSearchesPlugin],
  openOnFocus: true,
});
```

Since the `recentSearchesPlugin` reads from [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), you won't see any recent searches in your implementation until you've made some searches. To submit a search, be sure to press enter on the query. Once you do, you'll see it appear as a recent search. Try it out here:

<AutocompleteExample
  plugins={[recentSearchesPlugin]}
  openOnFocus={true}
/>

## Transforming recent searches

If you use Autocomplete as an entry point to a search page, you can turn recent searches into links:

```js
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  // ...
  transformSource({ source }) {
    return {
      ...source,
      getItemUrl({ item }) {
        return `/search?q=${item.query}`;
      },
      templates: {
        item(params) {
          const { item } = params;
          return (
            <a className="aa-ItemLink" href={`/search?q=${item.query}`}>
              {source.templates.item(params)}
            </a>
          );
        },
      },
    };
  },
});
```

If you use Autocomplete on your instant search page, you can plug some logic with `onSelect`:

```js
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  // ...
  transformSource({ source }) {
    return {
      ...source,
      onSelect({ item }) {
        // Assuming the refine function updates the search page state.
        refine(item.query);
      }
    };
  },
});
```

## Using your own storage

In some cases, you may not want to use [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for your recent search data. You may want to use [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) or handle recent searches on your back end. If so, you can use the [`createRecentSearchesPlugin`](createRecentSearchesPlugin) to implement your own storage:

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const recentSearchesPlugin = createRecentSearchesPlugin({
  // Implement your own storage
  storage: {
    getAll() {},
    onAdd() {},
    onRemove() {},
  },
});

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
  plugins: [recentSearchesPlugin],
});
```

## Next steps

This tutorial focuses on creating and adding recent searches to an autocomplete menu. Most autocomplete menus include recent searches in addition to suggested searches and possibly other items. Check out the guides on adding [suggested searches](adding-suggested-searches) and [static predefined items](sources#using-static-sources) for more information. To learn how to display multiple sections in one autocomplete, read the [guide on adding multiple categories in one autocomplete](including-multiple-result-types).
