---
id: plugins
title: Plugins
---

Plugins encapsulate and distribute custom Autocomplete behaviors.

An autocomplete can be much more than a functional combo box. **Autocomplete lets you extend and encapsulate custom behavior with its Plugin API.**

For example, the [official Algolia Insights plugin](createAlgoliaInsightsPlugin) automatically sends click and conversion events to the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/) whenever a user interacts with the autocomplete.

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

Let's create a plugin that searches into a static list of GitHub repositories.

```js
const gitHubReposPlugin = {
  getSources() {
    return [
      {
        getItems() {
          return [
            { name: 'algolia/autocomplete.js', stars: 1237 },
            { name: 'algolia/algoliasearch-client-javascript', stars: 884 },
            { name: 'algolia/algoliasearch-client-php', stars: 554 },
          ].filter(({ label }) =>
            label.toLowerCase().includes(query.toLowerCase())
          );
        },
        getItemUrl({ item }) {
          return `https://github.com/algolia/${item.name}`;
        },
        templates: {
          item({ item }) {
            const stars = new Intl.NumberFormat('en-US').format(item.stars);

            return `${item.name} (${stars} stars)`;
          },
          empty() {
            return 'No results.';
          },
        },
      },
    ];
  },
};

autocomplete({
  // ...
  plugins: [gitHubReposPlugin],
});
```

Now, if you're willing to package and distribute your plugin for other people to use, you might want to expose a function instead. For example, you can use the [GitHub API](https://docs.github.com/en/rest/reference/search#search-repositories) to search into all repositories, and let people pass [API parameters](https://docs.github.com/en/rest/reference/search#search-repositories--parameters) as plugin options.

```js title="createGitHubReposPlugin.js"
import qs from 'qs';
import unfetch from 'unfetch';
import debounce from 'debounce-promise';

const debouncedFetch = debounce(unfetch, 300);

export function createGitHubReposPlugin(options) {
  return {
    getSources({ query }) {
      const endpoint = [
        'https://api.github.com/search/repositories',
        qs.stringify({ ...options, q: query }),
      ].join('?');

      return debouncedFetch(endpoint)
        .then((response) => response.json())
        .then((repositories) => {
          return [
            {
              getItems() {
                return repositories.items;
              },
              getItemUrl({ item }) {
                return item.html_url;
              },
              templates: {
                item({ item }) {
                  const stars = new Intl.NumberFormat('en-US').format(
                    item.stargazers_count
                  );

                  return `${item.full_name} (${stars} stars)`;
                },
                empty() {
                  return 'No results.';
                },
              },
            },
          ];
        });
    },
  };
}
```

```js title="index.js"
import { autocomplete } from '@algolia/autocomplete-js';
import { createGitHubReposPlugin } from './createGitHubReposPlugin';

const gitHubReposPlugin = createGitHubReposPlugin({
  per_page: 10,
});

autocomplete({
  container: '#autocomplete',
  plugins: [gitHubReposPlugin],
});
```

You can see [this demo live on CodeSandbox](https://codesandbox.io/s/amazing-neumann-d3l1p).

:::note

The GitHub Search API is [rate limited](https://docs.github.com/en/rest/reference/search), which means you need to debounce calls to avoid 403 errors. For instant search results with no rate limiting, highlighted results, flexible custom ranking, and more, you can index repositories into [Algolia](https://www.algolia.com/) instead.

:::

### Official plugins

There are a few useful official plugins you can already use with Autocomplete.

- [`recent-searches`](createRecentSearchesPlugin): display a list of the latest searches the user made. It comes with a [pre-implemented version](createLocalStorageRecentSearchesPlugin) that connects with the user's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
- [`query-suggestions`](createQuerySuggestionsPlugin): plug [Algolia Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/js/) to your autocomplete.
- [`algolia-insights`](createAlgoliaInsightsPlugin): automatically send click and conversion events to the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/) whenever a user interacts with the autocomplete.

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

When defined, they're merged with the sources of your Autocomplete instance.

### `data`

> `unknown`

An extra plugin object to expose properties and functions as APIs.
