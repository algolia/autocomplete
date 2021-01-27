---
id: plugins
title: Plugins
---

Plugins encapsulate and distribute custom Autocomplete behaviors.

**Great autocomplete experiences are more than just functional autocomplete mechanisms.** They unleash their full power when augmented with custom functionalities that bring value to your end-users and help you reach your goals.

**Autocomplete lets you extend and encapsulate custom behavior with its Plugin API.** For example, the [official Algolia Insights plugin](createAlgoliaInsightsPlugin) automatically sends click and conversion events to the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/) whenever a user interacts with the autocomplete.

You can use one of our existing official plugins or build your own.

## Usage

### Using an Autocomplete plugin

When using an Autocomplete plugin, all you need to do is provide it via the `plugins` option.

For example, when using the Insights plugin, you can instantiate the plugin, then pass it down to your Autocomplete instance.

```js {11,15}
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import insightsClient from 'search-insights';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);
insightsClient('init', { appId, apiKey });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

autocomplete({
  // ...
  plugins: [algoliaInsightsPlugin],
});
```
:::note

Plugins execute sequentially, in the defined order.

:::

### Building your own plugin

An Autocomplete plugin is a simple object that implements the `AutocompletePlugin` interface.

It can provide sources, react to state changes, and hook into various autocomplete lifecycle steps. It has access to setters, including the [Context API](context), allowing it to store and retrieve arbitrary data at any time.

Let's create a plugin that adds a static list of GitHub repositories to the autocomplete results.

```js
const topGitHubRepositoriesPlugin = {
  getSources() {
    return [
      {
        getItems() {
          return [
            { name: 'algoliasearch-client-javascript', stargazersCount: 884 },
            { name: 'algoliasearch-client-php', stargazersCount: 554 },
            { name: 'hn-search', stargazersCount: 383 },
          ];
        },
        getItemUrl({ item }) {
          return `https://github.com/algolia/${item.name}`;
        },
        templates: {
          header() {
            return 'Discover our top 3 GitHub repositories';
          },
          item({ item }) {
            return item.name;
          },
        },
      },
    ];
  },
};

autocomplete({
  // ...
  plugins: [topGitHubRepositoriesPlugin],
});
```

Now, if you're willing to package and distribute your plugin for other people to use, you might want to expose a function instead.

```js
function createTopGitHubRepositoriesPlugin({ repositories, username }) {
  const sortedRepositories = repositories.sort(
    (a, b) => b.stargazersCount - a.stargazersCount
  );

  return {
    getSources() {
      return [
        {
          getItems() {
            return sortedRepositories;
          },
          getItemUrl({ item }) {
            return `https://github.com/${username}/${item.name}`;
          },
          templates: {
            header() {
              return `Discover our top ${repositories.length} GitHub repositories`;
            },
            item({ item }) {
              return item.name;
            },
          },
        },
      ];
    },
  };
}

const topGitHubRepositoriesPlugin = createTopGitHubRepositoriesPlugin({
  username: 'algolia',
  repositories: [
    // ...
  ],
});
```

### Official plugins

There are a few useful official plugins you can already use with Autocomplete.

#### Recent searches

The [`recent-searches`](createRecentSearchesPlugin) plugin lets you display a list of the latest searches the user made. It comes with a [pre-implemented version](createLocalStorageRecentSearchesPlugin) that connects with the user's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

```js
import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'navbar',
});

autocomplete({
  // ...
  openOnFocus: true,
  plugins: [recentSearchesPlugin],
});
```

If you want to store recent searches elsewhere, you can implement your own storage using [`createRecentSearchesPlugin`](createRecentSearchesPlugin).

```js
import { autocomplete } from '@algolia/autocomplete-js';
import { createRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

const endpoint = 'https://example.com/recent-searches-storage';

const recentSearchesPlugin = createRecentSearchesPlugin({
  storage: {
    getAll() {
      return fetch(endpoint).then((response) => response.json());
    },
    onAdd(item) {
      fetch(endpoint, { method: 'POST', body: JSON.stringify(item) });
    },
    onRemove(id) {
      fetch(`${endpoint}/${id}`, { method: 'DELETE' });
    },
  },
});

autocomplete({
  // ...
  openOnFocus: true,
  plugins: [recentSearchesPlugin],
});
```

:::note

The `getAll` function supports [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), meaning you can plug it to any asynchronous API.

:::

#### Query Suggestions

The [`query-suggestions`](createQuerySuggestionsPlugin) plugin allows you to plug [Algolia Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) to your autocomplete.

```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});

autocomplete({
  // ...
  plugins: [querySuggestionsPlugin],
});
```

#### Insights

The [`algolia-insights`](createAlgoliaInsightsPlugin) plugin automatically sends click and conversion events to the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/) whenever a user interacts with the autocomplete.


```js
import algoliasearch from 'algoliasearch/lite';
import { autocomplete } from '@algolia/autocomplete-js';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import insightsClient from 'search-insights';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);
insightsClient('init', { appId, apiKey });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

autocomplete({
  // ...
  plugins: [algoliaInsightsPlugin],
});
```

## Reference

### `subscribe`

> `(params: { onSelect: (fn: params: TParams) => void, onActive: (fn: params: TParams) => void, ...setters: AutocompleteSetters }) => void`

The function called when Autocomplete starts.

It lets you subscribe to lifecycle hooks and interact with the instance's state and context.

### `onStateChange`

> `(params: { state: AutocompleteState<TItem> }) => void`

The function called when the internal state changes.

### `onSubmit`

> `(params: { state: AutocompleteState, event: Event, ...setters: AutocompleteSetters }) => void`

The function called when the Autocomplete form is submitted.

### `onReset`

> `(params: { state: AutocompleteState, event: Event, ...setters: AutocompleteSetters }) => void`

The function called when the Autocomplete form is reset.

### `getSources`

> `(params: { query: string, state: AutocompleteState, ...setters: AutocompleteSetters }) => Array<AutocompleteSource> | Promise<Array<AutocompleteSource>>`

The sources to get the suggestions from.

When defined, they're merged with the sources on your Autocomplete instance.

### `data`

> `unknown`

An extra plugin object to expose properties and functions as APIs.
