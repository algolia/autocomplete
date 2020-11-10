### `getSources`

> **required**

The [sources](/docs/sources) to get the collections from.

### `id`

> `string` | defaults to `"autocomplete-0"` (incremented for each instance)

The autocomplete ID to create accessible attributes.

### `onStateChange`

> `(params: { state: AutocompleteState<TItem> }) => void`

Function called when the internal state changes.

### `placeholder`

> `string`

The text that appears in the search box input when there is no query.

### `autoFocus`

> `boolean` | defaults to `false`

Whether to focus the search box when the page is loaded.

### `defaultSelectedItemId`

> `number | null` | default to `null`

The default item index to pre-select.

We recommend using `0` when the query typed aims at opening suggestion links, without triggering an actual search.

### `openOnFocus`

> `boolean` | defaults to `false`

Whether to open the panel on focus when there's no query.

### `stallThreshold`

> `number` | defaults to `300`

The number of milliseconds that must elapse before the autocomplete experience is stalled.

### `initialState`

> `Partial<AutocompleteState>`

The initial state to apply when autocomplete is created.

### `environment`

> `typeof window` | defaults to `window`

The environment from where your JavaScript is running.

Useful if you're using autocomplete in a different context than `window`.

### `navigator`

> `Navigator`

Navigator API to redirect the user when a link should be opened.

Learn more on the [Navigator API](/docs/keyboard-navigation) documentation.

### `shouldPanelShow`

> `(params: { state: AutocompleteState }) => boolean`

The function called to determine whether the panel should open.

By default, it opens when there are items in the state.

### `onSubmit`

> `(params: { state: AutocompleteState, event: Event, ...setters }) => void`

The function called when the autocomplete form is submitted.

### `onInput`

> `(params: {query: string, state: AutocompleteState, ...setters }) => void`

The function called when the input changes.

This turns the experience in controlled mode, leaving you in charge of updating the state.

## `debug`

> `boolean` | defaults to `false`

Whether to consider the experience in debug mode. It is useful when developing because it doesn't close the panel when the blur event occurs.
