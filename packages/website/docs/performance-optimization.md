---
id: performance-optimization
title: Performance Optimization
---

## Lazy loading

<!-- prettier-ignore -->
:::caution
This section is incomplete.
:::

[See example](https://github.com/facebook/docusaurus/blob/878ce3132b94ecfc112793212fff3e16cb9e6318/packages/docusaurus-theme-search-algolia/src/theme/SearchBar/index.js).

## Preconnect

You can hint the browser that the website will load data from Algolia, and allows it to preconnect to the DocSearch cluster. It makes the first query faster, especially on mobile.

```html
<link rel="preconnect" href="https://BH4D9OD16A-dsn.algolia.net" crossorigin />
```

<!-- prettier-ignore -->
:::info
If you're using your own DocSearch crawler, you need to change `BH4D9OD16A` to your [Algolia `appId`](https://www.algolia.com/doc/api-reference/crawler/configuration/app-id/).
:::
