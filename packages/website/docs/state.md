---
id: state
title: State
---

The autocomplete state drives the behavior of the experience.

The state is passed to all lifecycle hooks so that you can customize the behavior.

# Guides

## Setting an initial state

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

## Listening state changes

You can create your own API based on the autocomplete state with the [`onStateChange`](createAutocomplete#onstatechange) prop.

```js
const autocomplete = createAutocomplete({
  // ...
  onStateChange({ state }) {
    console.log(state);
  },
});
```

# Reference

## State

### `highlightedIndex`

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

Whether the dropdown is opened.

### `suggestions`

> `Suggestion[]` | defaults to `[]`

The suggestions of the experience.

### `status`

> `'idle' | 'loading' | 'stalled' | 'error'` | defaults to `idle`

The status of the experience.

### `context`

> `object` | defaults to `{}`

The autocomplete context passed to lifecycle hooks.

Learn more on the [context](context) page.

## Setters

### `setHighlightedIndex`

> `(value: number | null) => void`

Sets the highlighted item index. Pass `null` to unselect items.

### `setQuery`

> `(value: string) => void`

Sets the query.

### `setSuggestions`

> `(value: any) => void`

Sets the suggestions.

### `setIsOpen`

> `(value: boolean) => void`

Sets the open state of the dropdown.

### `setStatus`

> `(value: 'idle' | 'loading' | 'stalled' | 'error') => void`

Sets the status of the experience.

### `setSuggestions`

> `(value: Suggestion[]) => void`

Sets the suggestions of the experience.

### `setContext`

> `(value: object) => void`

Sets the context passed in the lifecycle hooks.

Learn more on the [context](context) page.
