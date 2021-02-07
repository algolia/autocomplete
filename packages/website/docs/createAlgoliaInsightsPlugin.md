---
id: createAlgoliaInsightsPlugin
---

## Example

```ts
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

## Import

```ts
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
```

## Params

### `insightsClient`

> `InsightsClient` | required

The initialized Search Insights client.

### `onItemsChange`

> `(params: OnItemsChangeParams) => void`

Hook to send an Insights event when the items change.

This hook is debounced every 400ms to better reflect when items are acknowledged by the user.

```ts
type OnItemsChangeParams = {
  insights: InsightsApi;
  insightsEvents: ViewedObjectIDsParams[];
  state: AutocompleteState<any>;
};
```

### `onSelect`

> `(params: OnSelectParams) => void`

Hook to send an Insights event when an item is selected.

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

Hook to send an Insights event when an item is active.

```ts
type OnActiveParams = {
  insights: InsightsApi;
  insightsEvents: ClickedObjectIDsAfterSearchParams[];
  item: AlgoliaInsightsHit;
  state: AutocompleteState<any>;
  event: any;
};
```
