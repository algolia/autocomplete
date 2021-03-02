---
id: createAlgoliaInsightsPlugin
---

The Algolia Insights plugin automatically sends click and conversion events to the [Algolia Insights API](https://www.algolia.com/doc/rest-api/insights/) whenever a user interacts with the autocomplete.

## Installation

First, you need to install the plugin.

```bash
yarn add @algolia/autocomplete-plugin-algolia-insights@alpha
# or
npm install @algolia/autocomplete-plugin-algolia-insights@alpha
```

Then import it in your project:

```js
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
```

If you don't use a package manager, you can use a standalone endpoint:

```html
<script src="https://cdn.jsdelivr.net/npm/@algolia/autocomplete-plugin-algolia-insights@alpha"></script>
```

## Examples

This example uses the plugin within [`autocomplete-js`](autocomplete-js), along with the [`algoliasearch`](https://www.npmjs.com/package/algoliasearch) API client and [Search Insights](https://www.npmjs.com/package/search-insights) library.

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
  container: '#autocomplete',
  plugins: [algoliaInsightsPlugin],
});
```

The plugin exposes hooks to let you inject custom logic in the lifecycle: [`onItemsChange`](#onitemschange), [`onSelect`](#onselect), and [`onActive`](#onactive). You can use them to either customize the events sent to Algolia, or plug additional behavior.

For example, if you have several search experiences on your site, you can customize the event name to identify where the events came from:

```js
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onItemsChange({ insights, insightsEvents }) {
    const events = insightsEvents.map((insightsEvent) => ({
      ...insightsEvent,
      eventName: 'Product Viewed from Autocomplete',
    }));
    insights.viewedObjectIDs(...events);
  },
  onSelect({ insights, insightsEvents }) {
    const events = insightsEvents.map((insightsEvent) => ({
      ...insightsEvent,
      eventName: 'Product Selected from Autocomplete',
    }));
    insights.clickedObjectIDsAfterSearch(...events);
  },
});
```

If you're using another analytics provider along with Algolia Insights, you can leverage these hooks to send them events as well. For example, you can send Segment events:

```js
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onActive({ insights, insightsEvents }) {
    insightsEvents.forEach((insightsEvent) => {
      // Assuming you've initialized the Segment script
      // and identified the current user already
      analytics.track('Product Browsed from Autocomplete', insightsEvent);
    });
  },
});
```

:::note

If you send events to other analytics providers, it might make sense to [create a dedicated plugin](plugins/#building-your-own-plugin).

:::

## Parameters

### `insightsClient`

> `InsightsClient` | required

The initialized Search Insights client.

### `onItemsChange`

> `(params: OnItemsChangeParams) => void`

Hook to send an Insights event whenever the items change.

By default, it sends a `viewedObjectIDs` event.

In as-you-type experiences, items change as the user types. This hook is debounced every 400ms to reflect actual items that users notice and avoid generating too many events for items matching "in progress" queries.

```ts
type OnItemsChangeParams = {
  insights: InsightsApi;
  insightsEvents: ViewedObjectIDsParams[];
  state: AutocompleteState<any>;
};
```

### `onSelect`

> `(params: OnSelectParams) => void`

Hook to send an Insights event whenever an item is selected.

By default, it sends a `clickedObjectIDsAfterSearch` event.

```ts
type OnSelectParams = {
  insights: InsightsApi;
  insightsEvents: ClickedObjectIDsAfterSearchParams[];
  item: AlgoliaInsightsHit;
  state: AutocompleteState<any>;
  event: any;
};
```

### `onActive`

> `(params: OnActiveParams) => void`

Hook to send an Insights event whenever an item is active.

By default, it doesn't send any events.

```ts
type OnActiveParams = {
  insights: InsightsApi;
  insightsEvents: ClickedObjectIDsAfterSearchParams[];
  item: AlgoliaInsightsHit;
  state: AutocompleteState<any>;
  event: any;
};
```

## Resources

For a more comprehensive guide on how to best leverage Algolia Insights with Autocomplete, check the [Sending Algolia Insights events](sending-algolia-insights-events) guide.

You can also learn more about [Click and Conversion Analytics](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/) on the Algolia documentation.
