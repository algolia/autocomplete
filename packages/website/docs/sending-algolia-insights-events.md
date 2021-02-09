---
id: sending-algolia-insights-events
title: Sending Algolia Insights events
---

Learn how to send Algolia Insights events from your autocomplete menu.

:::note

Using this plugin requires an [Algolia](https://www.algolia.com/) application with the [Event Analytics](https://www.algolia.com/pricing/) feature enabled.

:::

If you're using [Algolia indices](https://www.algolia.com/doc/faq/basics/what-is-an-index/) as [sources](sources) in your autocomplete, Algolia provides [Search Analytics](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/out-of-the-box-analytics/) out-of-the-box. Search Analytics includes metrics like [top searches, top searches with no results, overall search counts](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/out-of-the-box-analytics/#what-do-search-analytics-measure), etc.

You may also want to capture [Click and Conversion Analytics](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/). These analytics take Algolia’s out-of-the-box [Search Analytics](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/out-of-the-box-analytics/) further by providing insights into actions users take after performing a search. They're useful to better understand your user's behavior and what they need from your app. This information can ultimately drive your business.

Capturing these analytics requires [sending events to Algolia](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/) when your users view, click, or convert on results. This tutorial explains how to automatically send events from your autocomplete using the [`autocomplete-plugin-algolia-insights`](createAlgoliaInsightsPlugin) package.
## Prerequisites

This tutorial assumes that you have:
- an autocomplete using one or more [Algolia indices](https://www.algolia.com/doc/faq/basics/what-is-an-index/) for your [sources](sources)
- front-end development proficiency with HTML, CSS, and JavaScript

:::note

If you haven't implemented an autocomplete using Algolia as a source yet, follow the [Getting Started guide](getting-started) first. For learning purposes, you can use the demo application credentials and index provided in this tutorial.
:::

## Getting started

First, begin with some boilerplate for the autocomplete implementation. Create a file called `index.js` in your `src` directory, and add the boilerplate below:

```js title="index.js"
import {
  autocomplete,
  getAlgoliaHits,
  highlightHit
} from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import { h, Fragment } from "preact";

const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

autocomplete({
  container: "#autocomplete",
  openOnFocus: true,
  plugins: [],
  getSources({ query }) {
    return [
      {
        getItems() {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName: "instant_search",
                query,
                params: {
                  clickAnalytics: true,
                }
              }
            ]
          });
        },
        templates: {
          item({ item }) {
            return <ProductItem hit={item} />;
          }
        }
      }
    ];
  }
});

function ProductItem({ hit }) {
  return (
    <Fragment>
      <div className="aa-ItemIcon">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {highlightHit({ hit, attribute: "name" })}
        </div>
        <div className="aa-ItemContentDescription">
          {highlightHit({ hit, attribute: "description" })}
        </div>
      </div>
      <button
        className="aa-ItemActionButton aa-TouchOnly aa-ActiveOnly"
        type="button"
        title="Select"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z"></path>
        </svg>
      </button>
    </Fragment>
  );
}
```

This boilerplate assumes you want to insert the autocomplete into a DOM element with `autocomplete` as an [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). You should change the [`container`](autocomplete-js/#container) to [match your markup](basic-options). Setting [`openOnFocus`](autocomplete-js/#openonfocus) to `true` ensures that the dropdown appears as soon as a user focuses the input.

The autocomplete searches into an [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) of [e-commerce products](https://github.com/algolia/datasets/tree/master/ecommerce) using the [`getAlgoliaHits`](getAlgoliaHits) function. Refer to the example in the [Getting Started guide](getting-started) for more information.

:::note

You must set the [`clickAnalytics`](https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/) query parameter to `true` to send click and conversion events from your autocomplete.

:::

For now, `plugins` is an empty array, but you'll learn how to add the Insights [plugin](plugins) next.

## Sending Algolia Insights events

The [`autocomplete-plugin-algolia-insights`](createAlgoliaInsightsPlugin) package provides the [`createAlgoliaInsightsPlugin`](createAlgoliaInsightsPlugin) function for creating an Insights [plugin](plugins) out-of-the-box.

It requires an [Algolia Insights client](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/how-to/sending-events-with-api-client/#initializing-the-insights-client) initialized with an [Algolia application ID and Search API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id).

```js title="index.js"
import {
  autocomplete,
  getAlgoliaHits,
  highlightHit
} from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import { h, Fragment } from "preact";
import { createAlgoliaInsightsPlugin } from "@algolia/autocomplete-plugin-algolia-insights";
import insightsClient from "search-insights";

const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

insightsClient("init", { appId, apiKey });
const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });

autocomplete({
  container: "#autocomplete",
  placeholder: "Search products",
  openOnFocus: true,
  plugins: [algoliaInsightsPlugin],
  getSources({ query }) {
    // ...
  }
});

function ProductItem({ hit }) {
    // ...
}
```

Now, whenever the autocomplete shows products in the dropdown, the plugin sends [view events](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/#view) with the [`eventName`](https://www.algolia.com/doc/api-reference/api-methods/viewed-object-ids/#method-param-eventname) "Items Viewed" for these products. If a user clicks a product, the plugin sends a [click event](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/#click), with the [`eventName`](https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids-after-search/#method-param-eventname) "Item Selected" for that product. By default, the plugin doesn't send any [conversion events](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/#conversion).

## Customizing events

You can change any of the plugin's default behavior by using the [`onItemsChange`](createAlgoliaInsightsPlugin#onitemschange), [`onSelect`](createAlgoliaInsightsPlugin#onselect), or [`onActive`](createAlgoliaInsightsPlugin#onactive) hooks. For example, you may want to customize the `eventName` to match your [naming conventions](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/best-practices-for-sending-events/#naming-events-consistently) or send a different events on these actions.

### Changing the `eventName`

This snippet shows how to instantiate a plugin that sends a click event with "Product Selected from Autocomplete" as the `eventName` whenever a user selects an item. You may want to do this to differentiate between click events sent from your Autocomplete vs. other parts of your search implementation.

```js title="index.js"
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);
insightsClient("init", { appId, apiKey });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onSelect({ insights, insightsEvents }) {
    const events = insightsEvents.map((insightsEvent) => ({
      ...insightsEvent,
      eventName: 'Product Selected from Autocomplete',
    }));
    insights.clickedObjectIDsAfterSearch(...events);
  },
})
```

### Sending different events for different result types

If you're [using multiple different Algolia indices in the same autocomplete](including-multiple-result-types), for example one for products and one for suggestions, you may want to use different `eventName`s for each section. You can change this (and other parts of the event) conditionally based on the source index name:

```js title="index.js"
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);
insightsClient("init", { appId, apiKey });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onSelect({ insights, insightsEvents }) {
    const events = insightsEvents.map((insightsEvent) => {
      switch (insightsEvent.index) {
        case 'instant_search_demo_query_suggestions': {
          return {
            ...insightsEvent,
            eventName: 'Suggestion Selected from Autocomplete',
          };
        }
        case 'instant_search': {
          return {
            ...insightsEvent,
            eventName: 'Product Selected from Autocomplete',
          };
        }
        default: {
          return {
            ...insightsEvent,
            eventName: 'Item Selected from Autocomplete',
          };
        }
      }
    });
    insights.clickedObjectIDsAfterSearch(...events);
  },
});
```

## Sending events from templates

Though the default Insights plugin doesn't send any conversion events, you may want to. For example, you may have created a [template](templates) with an "Add to cart" button.

![Autocomplete with add to cart button](/img/add-to-cart.jpg)

If a user adds an item to their shopping cart directly from the autocomplete, you can send a conversion event from your template:

```jsx title="ProductItem.jsx"
function ProductItem({ hit, insights }) {
  return (
    <Fragment>
      <div className="aa-ItemIcon">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {snippetHit({ hit, attribute: 'name' })}
        </div>
        <div className="aa-ItemContentDescription">
          {snippetHit({ hit, attribute: 'description' })}
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton"
          type="button"
          title="Add to cart"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            insights.convertedObjectIDsAfterSearch({
              eventName: 'Added to cart',
              index: hit.__autocomplete_indexName,
              objectIDs: [hit.objectID],
              queryID: hit.__autocomplete_queryID,
            });
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </Fragment>
  );
}
```

This is possible since the plugin stores the Insights API in [Context](context). Using it, you can send events from a [template](templates). For more information on the methods and event types you can send using the Insights API, consult the [Algolia Insights documentation](https://www.algolia.com/doc/api-client/methods/insights/).
## Validating events

To ensure that you're sending events as you expect, you can check your [Algolia Insights logs](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/validating-events/#insights-api-logs) or work with the [Insights Validator Chrome extension](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/validating-events/#insights-validator-chrome-extension). Check out the [guide on validating events](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/validating-events/) for more details.
