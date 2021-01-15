---
id: state
title: Controlling behavior with State
---

The state drives the behavior of the autocomplete experience.

The state is an underlying set of properties that drives the autocomplete behavior. For example, `query` contains the value typed in the search input. As the query changes, the retrieved items from the [sources](/docs/sources) change.

The state contains:
- `query`: the search input value
- `activeItemId`: which item is active
- `completion`: the completed version of the query
- `isOpen`: whether the autocomplete display panel is open or not
- `status`: the autocomplete status
- `collections`: the autocomplete's collections of items
- `context`: the global context passed to lifecycle hooks (see more in [**Context**](/docs/context))

## Usage

The state is available in all lifecycle hooks so you can customize the behavior.

### Setting an initial state

You can instantiate an autocomplete with an initial state via the [`initialState`](/docs/autocomplete-js/#initialstate) prop.

```js
const autocomplete = createAutocomplete({
  // ...
  initialState: {
    // This uses the `search` query parameter as the initial query
    query: new URL(window.location).searchParams.get('search'),
  },
});
```

### Listening to state changes

State changes occur automatically when a user interacts with the autocomplete (updates the input text, selects an item, etc.). You can react to state changes using the [`onStateChange`](createAutocomplete#onstatechange) lifecycle hook.

```js
const autocomplete = createAutocomplete({
  // ...
  onStateChange({ state }) {
    console.log(state);
  },
});
```

You can also manually update the state using setters. It's useful to implement custom features on top of autocomplete.

In the following example, when detecting a potential filter in the query, you're manually adding it to the list of active filters using [Context](context) and removing it from the query.

```js
const categories = ['Tops', 'Bottoms', 'Hats', 'Bags', 'Footwear'];

const autocomplete = createAutocomplete({
  // ...
  onStateChange({ state, setQuery, setContext }) {
    const { query, context } = state;
    const match = categories.find((category) => query.endsWith(category));

    if (match) {
      const filters = [...context.filters, match];
      const position = query.lastIndexOf(match);

      setContext({ filters });
      setQuery(query.substr(0, position));
    }
  },
});
```

## State

### `activeItemId`

> `number | null` | defaults to `null`

The highlighted item's index.

### `query`

> `string` | defaults to `""`

The value of the search input.

### `completion`

> `string | null` | defaults to `null`

The completion of the query.

### `isOpen`

> `boolean` | defaults to `false`

Whether the panel is open or not.

### `collections`

> `Collection[]` | defaults to `[]`

The collections of items.

### `status`

> `'idle' | 'loading' | 'stalled' | 'error'` | defaults to `idle`

The autocomplete's status.

### `context`

> `AutocompleteContext` | defaults to `{}`

The global context passed to lifecycle hooks.

See more in [**Context**](context).

## Setters

### `setActiveItemId`

> `(value: number | null) => void`

Sets the highlighted item index. Pass `null` to unselect items.

### `setQuery`

> `(value: string) => void`

Sets the query.

### `setIsOpen`

> `(value: boolean) => void`

Sets whether the panel is open or not.

### `setStatus`

> `(value: 'idle' | 'loading' | 'stalled' | 'error') => void`

Sets the status of the autocomplete.

### `setCollections`

> `(value: Collection[]) => void`

Sets the collections of items of the autocomplete.

### `setContext`

> `(value: AutocompleteContext) => void`

Sets the context passed to lifecycle hooks.

See more in [**Context**](context).
