---
id: sending-algolia-insights-events
title: Sending Algolia Insights events
---

Learn how to automatically send Algolia Insights events from your autocomplete menu.

:::note

Using this plugin requires an [Algolia](https://www.algolia.com/) application with the [Event Analytics](https://www.algolia.com/pricing/) feature enabled.

:::

If you're using [Algolia indices](https://www.algolia.com/doc/faq/basics/what-is-an-index/) as [sources](sources) in your autocomplete, Algolia provides [Search Analytics](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/out-of-the-box-analytics/) out-of-the-box. Search Analytics includes metrics like [top searches, top searches with no results, overall search counts, etc.](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/out-of-the-box-analytics/#what-do-search-analytics-measure) It is a great feature to better understand your user's behavior, what they need from your app and ultimately to drive your business.

You may also want to capture [Click and Conversion Analytics](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/). Click and Conversion Analytics takes Algolia’s out-of-the-box Search Analytics further by providing insights into actions users take after performing a search. They also form the basis for more advanced features like [A/B testing](https://www.algolia.com/doc/guides/ab-testing/what-is-ab-testing/), [Dynamic Re-Ranking](https://www.algolia.com/doc/guides/ai-optimizations/re-ranking/), and [Personalization](https://www.algolia.com/doc/guides/personalization/what-is-personalization/).

Capturing these analytics requires [sending events to Algolia](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/) when your users view, click, or convert on results. This tutorial explains how to automatically send events from your autocomplete using the [`autocomplete-plugin-algolia-insights`](createAlgoliaInsightsPlugin) package.
## Prerequisites

This tutorial assumes that you have:
- implemented an autocomplete using one or more [Algolia indices](https://www.algolia.com/doc/faq/basics/what-is-an-index/) for your [sources](sources)
- front-end development proficiency with HTML, CSS, and JavaScript

To follow along with the tutorial, you can start with the markup and style sheets from the [complete example](to-do). The tutorial includes code snippets of the JavaScript necessary to send events.

:::note

If you don't haven't implemented an autocomplete using Algolia as a source yet, follow the [Getting Started guide](getting-started) first.

:::

## Getting started

First, begin with some boilerplate for the autocomplete implementation—create a file called `index.js` in your `src` directory, and add the boilerplate below:

```js
import {
  autocomplete,
  getAlgoliaHits,
  snippetHit
} from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import { h, Fragment } from "preact";

// Instantiate Algolia search client
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

// Instantiate the autocomplete instance
autocomplete({
  container: "#autocomplete",
  placeholder: "Search products",
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

// Define how to display each product result in the autocomplete
function ProductItem({ hit }) {
  return (
    <Fragment>
      <div className="aa-ItemIcon">
        <img src={hit.image} alt={hit.name} width="40" height="40" />
      </div>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          {snippetHit({ hit, attribute: "name" })}
        </div>
        <div className="aa-ItemContentDescription">
          {snippetHit({ hit, attribute: "description" })}
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

This boilerplate assumes you want to insert the autocomplete into a DOM element with `autocomplete` as an [id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). You should change the [`container`](autocomplete-js/#container) to [match your markup](basic-options). Setting [`openOnFocus`](autocomplete-js/#openonfocus) to `true` ensures that the dropdown appears as soon as a user clicks on the input.

The autocomplete searches into an [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) of [BestBuy products](https://github.com/algolia/datasets/tree/master/ecommerce) using the [`getAlgoliaHits`](getAlgoliaHits) function. Refer to the example in the [Getting Started guide](getting-started) for more information.

:::note

You must set the [`clickAnalytics`](https://www.algolia.com/doc/api-reference/api-parameters/clickAnalytics/) query parameter to `true` to properly send click and conversion events from your autocomplete.

:::

For now, `plugins` is an empty array, but you'll learn how to add the Insights plugin next.

## Sending Algolia Insights events

The [`autocomplete-plugin-algolia-insights`](createAlgoliaInsightsPlugin) package provides the [`createAlgoliaInsightsPlugin`](createAlgoliaInsightsPlugin) function for creating an Insights plugin out-of-the-box.

It requires an [Algolia Insights client](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/how-to/sending-events-with-api-client/#initializing-the-insights-client) initialized with an [Algolia application ID and Search API key](https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/how-to/importing-with-the-api/#application-id).

```diff
import {
  autocomplete,
  getAlgoliaHits,
  snippetHit
} from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch";
import { h, Fragment } from "preact";
+ import { createAlgoliaInsightsPlugin } from "@algolia/autocomplete-plugin-algolia-insights";
+ import insightsClient from "search-insights";
+
// Instantiate Algolia search client
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);
+
+ // Instantiate Algolia Insights client and Insights plugin
+ insightsClient("init", { appId, apiKey });
+ const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });
+
// Instantiate the autocomplete instance
autocomplete({
  container: "#autocomplete",
  placeholder: "Search products",
  openOnFocus: true,
-  plugins: [],
+  plugins: [algoliaInsightsPlugin],
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
                  attributesToSnippet: ["name:10", "description:35"],
                  snippetEllipsisText: "…"
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
          {snippetHit({ hit, attribute: "name" })}
        </div>
        <div className="aa-ItemContentDescription">
          {snippetHit({ hit, attribute: "description" })}
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

Now, whenever the autocomplete shows products in the dropdown, the plugin sends [view events](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/#view) with the [`eventName`](https://www.algolia.com/doc/api-reference/api-methods/viewed-object-ids/#method-param-eventname) "Items Viewed" for these products. If a user clicks a product, the plugin sends a [click event](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/#click), with the [`eventName`](https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids-after-search/#method-param-eventname) "Item Selected" for that product. By default, the plugin doesn't send any [conversion events](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/capturing-user-behavior-as-events/#conversion).

You can change any of the plugins default behavior by using the [`onItemsChange`](createAlgoliaInsightsPlugin#onitemschange), [`onSelect`](createAlgoliaInsightsPlugin#onselect), or [`onActive`](createAlgoliaInsightsPlugin#onactive) hooks. For example, you may want to customize the `eventName` to match your [naming convetions](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/best-practices-for-sending-events/#naming-events-consistently) or send a different events on these actions.

This snippet shows how to instantiate a plugin that sends a click event with "Product Selected from Autocomplete" as the `eventName` whenever a user selects an item.

```js
const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);
insightsClient("init", { appId, apiKey });

const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({
  insightsClient,
  onSelect: {/***/}
});
```

## Validating events

To ensure that you're sending events as you expect, you can check your [Algolia Insights logs](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/validating-events/#insights-api-logs) or work with the [Insights Validator Chrome extension](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/validating-events/#insights-validator-chrome-extension). Check out the [guide on validating events](https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-and-conversion-analytics/in-depth/validating-events/) for more details.
