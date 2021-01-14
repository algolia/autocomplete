---
id: state
title: Controlling behavior with State
---

The autocomplete state drives the behavior of the experience.

:::note Draft

This page needs to cover:

- State is the underlying set of properties that drives the autocomplete behavior. For example, the **query** state is the value in the input to search and retrieve items for. As the query state changes, the items retrieved and displayed from the **sources** change.
- Autocomplete state is made up of:
  - query - the value in the input to search for
  - selectedItemId - which item (if any) is selected
  - completion - the completed version of the input text
  - isOpen - if the autocomplete display panel is open
  - status - 'idle' | 'loading' | 'stalled' | 'error'
  - collections - **Sources** and items powering the experience
  - context - global state passed to lifecycle hooks, see more in **Context**
- You can set an **initialState** when instantiating an autocomplete.
  - Code snippet
- State changes occur automatically when a user changes the input, selects an item, etc. You can also manually set the state using setters
  - For example, you may want to manually set the query in some cases
    - Code snippet
  - This is the full list of setters:
    - setQuery
    - setSelectedItemId
    - setIsOpen
    - setStatus
    - setCollections
    - setContext
- Finally, you can listen for state changes using **onStateChange**
  - Code snippet

:::

The state is passed to all lifecycle hooks so that you can customize the behavior.

## Examples

### Setting an initial state

You can instantiate autocomplete with an initial state with the `initialState` prop.

```js
const autocomplete = createAutocomplete({
  // ...
  initialState: {
    // This sets the `search` query param as initial query.
    // Example: `https://website.com/?search=navigator
    query: new URL(window.location).searchParams.get('search'),
  },
});
```

### Listening state changes

You can create your own API based on the autocomplete state with the [`onStateChange`](createAutocomplete#onstatechange) prop.

```js
const autocomplete = createAutocomplete({
  // ...
  onStateChange({ state }) {
    console.log(state);
  },
});
```

## State

### `activeItemId`

> `number | null` | defaults to `null`

The highlighted item index.

### `query`

> `string` | defaults to `""`

The query of the input.

### `completion`

> `string | null` | defaults to `null`

The completion of the input.

### `isOpen`

> `boolean` | defaults to `false`

Whether the panel is opened.

### `collections`

> `Collection[]` | defaults to `[]`

The collections of the experience.

### `status`

> `'idle' | 'loading' | 'stalled' | 'error'` | defaults to `idle`

The status of the experience.

### `context`

> `object` | defaults to `{}`

The autocomplete context passed to lifecycle hooks.

Learn more on the [context](context) page.

## Setters

### `setActiveItemId`

> `(value: number | null) => void`

Sets the highlighted item index. Pass `null` to unselect items.

### `setQuery`

> `(value: string) => void`

Sets the query.

### `setIsOpen`

> `(value: boolean) => void`

Sets the open state of the panel.

### `setStatus`

> `(value: 'idle' | 'loading' | 'stalled' | 'error') => void`

Sets the status of the experience.

### `setCollections`

> `(value: Collection[]) => void`

Sets the collections of the experience.

### `setContext`

> `(value: object) => void`

Sets the context passed in the lifecycle hooks.

Learn more on the [context](context) page.
