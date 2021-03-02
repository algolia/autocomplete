---
id: plugins
title: Plugins
---

import PluginsList from './partials/plugins-list.md'

Plugins encapsulate and distribute custom Autocomplete behaviors.

An autocomplete can be much more than a functional combo box. **Autocomplete lets you extend and encapsulate custom behavior with its Plugin API.**

For example, the [official Algolia Insights plugin](createAlgoliaInsightsPlugin) automatically sends click and conversion events to the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/) whenever a user interacts with the autocomplete.

You can use one of the existing official plugins or build your own.

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

Plugins execute sequentially, in the order you define them.

:::

### Building your own plugin

An Autocomplete plugin is an object that implements the `AutocompletePlugin` interface.

It can [provide sources](sources), react to [state changes](state), and hook into various autocomplete lifecycle steps. It has access to setters, including the [Context API](context), allowing it to store and retrieve arbitrary data at any time.

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
          noResults() {
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

If you want to package and distribute your plugin for other people to use, you might want to expose a function instead. For example, you can use the [GitHub API](https://docs.github.com/en/rest/reference/search#search-repositories) to search into all repositories, and let people pass [API parameters](https://docs.github.com/en/rest/reference/search#search-repositories--parameters) as plugin options.

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
                noResults() {
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

#### Subscribing to source lifecycle hooks

When building, you also get access to the [`subscribe`](#subscribe) method. It runs once when the autocomplete instance starts and lets you subscribe to lifecycle hooks and interact with the instance's state and context.

For example, let's say you want to build a plugin that sends events to Google Analytics when the user navigates results. You can use `subscribe` to hook into `onSelect` and `onActive` events and use the [Google Analytics API](https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits) there.

```js
function createGoogleAnalyticsPlugin({ trackingId, options }) {
  return {
    subscribe({ onSelect, onActive }) {
      ga('create', trackingId, ...options);

      const event = {
        hitType: 'event',
        eventCategory: 'Autocomplete',
        eventLabel: item.name,
      };

      onSelect(({ item }) => {
        ga('send', {
          ...event,
          eventAction: 'select',
        });
      });

      onActive(({ item }) => {
        ga('send', {
          ...event,
          eventAction: 'active',
        });
      });
    },
  };
}
```

### Official plugins

There are a few useful official plugins you can already use with Autocomplete.

<PluginsList />

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
