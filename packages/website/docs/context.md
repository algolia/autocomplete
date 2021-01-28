---
id: context
title: Accessing data with Context
---

The Context lets you store data and access it in different lifecycle hooks.

Sometimes you need to store arbitrary data so you can access it later in your autocomplete. For example, when retrieving hits from Algolia, you may want to reuse the total number of retrieved hits in a template.

Autocomplete lets you store data using its Context API and access it anywhere from the [state](/docs/state).

## Usage

Context exposes a `setContext` function, which takes an object and merges it with the existing context. You can then access the context in `state.context`.

The following example stores the number of hits from an Algolia response, making it accessible everywhere in your autocomplete.

```js
autocomplete({
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
    }).then(([products]) => {
      setContext({
        nbProducts: products.nbHits,
      });

      // You can now use `state.context.nbProducts`
      // anywhere where you have access to `state`.

      return [
        // ...
      ];
    });
  },
});
```

Context can be handy when developing [Autocomplete plugins](/docs/plugins). It avoids polluting the global namespace while still being able to pass data around across different lifecycle hooks.

```js
function createAutocompletePlugin() {
  return {
    // ...
    subscribe({ setContext }) {
      setContext({
        autocompletePlugin: {
          // ...
        },
      });
    },
  };
}
```

## Reference

The `setContext` function is accessible on your `autocomplete` instance.

It's also provided in:
- [`getSources`](createAutocomplete#getsources)
- [`onInput`](createAutocomplete#oninput)
- [`onSubmit`](createAutocomplete#onsubmit)
- [`onReset`](createAutocomplete#onreset)
- [`source.onActive`](sources#onactive)
- [`source.onSelect`](sources#onselect)
- [`source.getItems`](sources#getitems)
- `plugin.subscribe`

The `context` object is available on the [`state`](/docs/state) object.

### `setContext`

> `(value: Record<string, unknown>) => void`

The function to pass data to to store it in the context.

### `context`

> `Record<string, unknown>`

The context to read data from.
