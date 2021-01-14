---
id: context
title: Accessing data with Context
---

The autocomplete context allows to store data in the state to use in different lifecycle hooks.

:::note Draft

This page needs to cover:

- You can use **context** to store and access data in the **state**. You can think of it as a global variable.
- For example, you can use **context** to store data regarding the number of hits from an Algolia response, and then use this when creating **templates** in your sources. Without storing this value in the **context**, you wouldn’t have access to it in the templates.
- Like all setters, **setContext** expects an object that it will merge with the previous context object.
  - Code snippet (including setContext and using context.nbHits in a template)
- **Plugins** can also store their API in **context**

:::

You can use this API to access data in the templates that you would otherwise have access only in `getSources` for instance. The `setContext` setters expects an object that will be merged with the previous context. You can then read the context in `state.context`.

The following example stores the number of hits from an Algolia response to display it in the templates.

```js
const autocomplete = createAutocomplete({
  // ...
  getSources({ query, setContext }) {
    return getAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'instant_search',
          query,
        },
      ],
    }).then((results) => {
      const productsResults = results[0];

      setContext({
        nbProducts: productsResults.nbHits,
      });

      // You can now use `state.context.nbProducts` anywhere you have access to
      // the state.

      return [
        // ...
      ];
    });
  },
});
```
