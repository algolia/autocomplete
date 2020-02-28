---
id: context
title: Context
---

The autocomplete context allows to store data in the state to use in different lifecycle hooks.

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
    }).then(results => {
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
