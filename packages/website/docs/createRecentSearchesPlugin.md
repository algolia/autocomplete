---
id: createRecentSearchesPlugin
---

The Recent Searches plugin displays a list of the latest searches the user made.

The `createRecentSearchesPlugin` plugin lets you implement your own storage. To connect with the user's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), check [`createLocalStorageRecentSearchesPlugin`](createLocalStorageRecentSearchesPlugin).

## Installation

First, you need to install the plugin.

```bash
yarn add @algolia/autocomplete-plugin-recent-searches@alpha
# or
npm install @algolia/autocomplete-plugin-recent-searches@alpha
```

Then import it in your project:

```js
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-plugin-recent-searches@alpha"></script>
```

## Example

This example uses the plugin within [`autocomplete-js`](autocomplete-js). You're in charge of implementing the storage to fetch and save recent searches.

```js
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

For example, you can plug it to a MongoDB database using [mongoose](https://mongoosejs.com/).

```js
import mongoose from 'mongoose';
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { search } from '@algolia/autocomplete-plugin-recent-searches/usecases/localStorage';

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true });

const schema = new mongoose.Schema({
  objectID: String,
  query: String,
  category: {
    type: String,
    default: undefined,
  },
});
const RecentSearchesItem = mongoose.model('RecentSearchesItem', schema);

const recentSearchesPlugin = createRecentSearchesPlugin({
  storage: {
    async getAll(query) {
      const items = await RecentSearchesItem.find({});

      return search({ query, items, limit: 5 });
    },
    onAdd(item) {
      RecentSearchesItem.create(item);
    },
    onRemove(objectID) {
      RecentSearchesItem.deleteOne({ objectID });
    },
  },
});
```

You can combine this plugin with the [Query Suggestions](createQuerySuggestionsPlugin) plugin to leverage the empty screen with recent and popular queries.

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const recentSearchesPlugin = createRecentSearchesPlugin({
  // Implement your own storage
  storage: {
    getAll() {},
    onAdd() {},
    onRemove() {},
  },
});
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
  getSearchParams() {
    return recentSearches.data.getAlgoliaSearchParams();
  },
});

autocomplete({
  container: '#autocomplete',
  openOnFocus: true,
  plugins: [recentSearchesPlugin, querySuggestionsPlugin],
});
```

## Parameters

### `storage`

> `RecentSearchesStorage` | required

The storage to fetch from and save recent searches into.

```ts
type RecentSearchesItem = {
  id: string;
  query: string;
};
type RecentSearchesStorage<TItem extends RecentSearchesItem> = {
  onAdd(item: TItem): void;
  onRemove(id: string): void;
  getAll(query?: string): MaybePromise<Array<Highlighted<TItem>>>;
};
```

### `transformSource`

> `(params: { source: AutocompleteSource, onRemove: () => void, onTapAhead: () => void })`

A function to transform the source based on the Autocomplete state.

#### Examples

Keeping the panel open on select:

```tsx
const recentSearchesPlugin = createRecentSearchesPlugin({
  storage,
  transformSource({ source, onRemove }) {
    return {
      ...source,
      onSelect({ setIsOpen }) {
        setIsOpen(true);
      },
    };
  },
});
```

Opening a link:

```tsx
const recentSearchesPlugin = createRecentSearchesPlugin({
  storage,
  transformSource({ source, onRemove }) {
    return {
      ...source,
      getItemUrl({ item }) {
        return `https://google.com?q=${item.query}`;
      },
      templates: {
        ...source.templates,
        item(params) {
          const { item } = params;
          return (
            <a
              className="aa-ItemLink"
              href={`https://google.com?q=${item.query}`}
            >
              {source.templates.item(params)}
            </a>
          );
        },
      },
    };
  },
});
```

## Returns

### `data`

#### `getAlgoliaSearchParams`

> `SearchParameters => SearchParameters`

Optimized [Algolia search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/). This is useful when using the plugin along with the [Query Suggestions](createQuerySuggestionsPlugin) plugin.

This function enhances the provided search parameters by:

- Excluding Query Suggestions that are already displayed in recent searches.
- Using a shared `hitsPerPage` value to get a group limit of Query Suggestions and recent searches.
