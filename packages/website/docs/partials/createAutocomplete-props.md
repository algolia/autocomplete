### `getSources`

> **required**

The [sources](sources) to get the collections from.

### `id`

> `string` | defaults to `"autocomplete-0"` (incremented for each instance)

An ID for the autocomplete. This is necessary to create accessible attributes.

### `onStateChange`

> `(params: { state: AutocompleteState<TItem> }) => void`

The function called when the internal state changes.

### `placeholder`

> `string`

The placeholder text to show in the search input when there's no query.

### `autoFocus`

> `boolean` | defaults to `false`

Whether to focus the search input or not when the page is loaded.

### `defaultActiveItemId`

> `number | null` | default to `null`

The default item index to pre-select.

We recommend using `0` when the query typed aims at opening item links, without triggering an actual search.

### `openOnFocus`

> `boolean` | defaults to `false`

Whether to open the panel on focus or not when there's no query.

### `stallThreshold`

> `number` | defaults to `300`

How many milliseconds must elapse before considering the autocomplete experience [stalled](state#status).

### `initialState`

> `Partial<AutocompleteState>`

The initial state to apply when autocomplete is created.

### `environment`

> `typeof window` | defaults to `window`

The environment in which your application is running.

This is useful if you're using autocomplete in a different context than `window`.

### `navigator`

> `Navigator`

An implementation of Autocomplete's Navigator API to redirect the user when opening a link.

Learn more on the [**Navigator API**](keyboard-navigation) documentation.

### `shouldPanelOpen`

> `(params: { state: AutocompleteState }) => boolean`

The function called to determine whether the panel should open or not.

By default, the panel opens when there are items in the state.

### `onSubmit`

> `(params: { state: AutocompleteState, event: Event, ...setters }) => void`

The function called when submitting the Autocomplete form.

### `onReset`

> `(params: { state: AutocompleteState, event: Event, ...setters }) => void`

The function called when resetting the Autocomplete form.

### `debug`

> `boolean` | defaults to `false`

A flag to activate the debug mode.

This is useful while developing because it keeps the panel open even when the blur event occurs. **Make sure to disable it in production.**

See [**Debugging**](debugging) for more information.
