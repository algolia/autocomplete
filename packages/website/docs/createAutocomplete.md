---
id: createAutocomplete
---

This function returns the methods to create an autocomplete experience.

<!-- prettier-ignore -->
:::caution
This page is incomplete.
:::

# Example

```js
const items = [
  { value: 'Apple', count: 120 },
  { value: 'Banana', count: 100 },
  { value: 'Cherry', count: 50 },
  { value: 'Orange', count: 150 },
];

const autocomplete = createAutocomplete({
  getSources() {
    return [
      {
        getSuggestions({ query }) {
          return items.filter(item =>
            item.value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
          );
        },
        getInputValue({ suggestion }) {
          return suggestion.value;
        },
      },
    ];
  },
});
```

# Reference

## Options

### `id`

> `string` | defaults to `"autocomplete-0"` (incremented for each instance)

The autocomplete ID to create accessible attributes.

## Returned props

```js {2-14}
const {
  getEnvironmentProps,
  getRootProps,
  getFormProps,
  getInputProps,
  getItemProps,
  getLabelProps,
  getMenuProps,
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
} = createAutocomplete(options);
```

### `getEnvironmentProps`

Returns the props to attach to the [environment](#environment).

You need to pass `searchBoxElement`, `dropdownElement` and `inputElement` so that the library creates the correct touch events for touch devices.

```ts
type GetEnvironmentProps = (props: {
  [key: string]: unknown;
  searchBoxElement: HTMLElement;
  dropdownElement: HTMLElement;
  inputElement: HTMLInputElement;
}) => {
  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
};
```

### `getRootProps`

Returns the props to attach to the root element.

```ts
type GetRootProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-expanded': boolean;
  'aria-haspopup': string;
  'aria-owns': string;
  'aria-labelledby': string;
};
```

### `getFormProps`

Returns the props to attach to the form element.

You need to pass the `inputElement` so that the library can manage the focus of the input.

```ts
type GetFormProps = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement | null;
}) => {
  onSubmit(event: Event): void;
  onReset(event: Event): void;
};
```

### `getInputProps`

Returns the props to attach to the input element.

You need to pass the `inputElement` so that the library can manage the focus of the input.

```ts
type GetInputProps = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement;
}) => {
  id: string;
  value: string;
  autofocus: boolean;
  placeholder: string;
  autoComplete: 'on' | 'off';
  autoCorrect: 'on' | 'off';
  autoCapitalize: 'on' | 'off';
  spellCheck: boolean;
  'aria-autocomplete': 'none' | 'inline' | 'list' | 'both';
  'aria-activedescendant': string | null;
  'aria-controls': string | null;
  'aria-labelledby': string;
  onInput(event: Event): void;
  onKeyDown(event: KeyboardEvent): void;
  onFocus(): void;
  onBlur(): void;
  onClick(event: MouseEvent): void;
};
```

### `getItemProps`

Returns the props to attach to each item.

You need to pass the `item` and the `source` so that the library computes the state.

```ts
type GetItemProps<TItem> = (props: {
  [key: string]: unknown;
  item: TItem;
  source: AutocompleteSource<TItem>;
}) => {
  id: string;
  role: string;
  'aria-selected': boolean;
  onMouseMove(event: MouseEvent): void;
  onMouseDown(event: MouseEvent): void;
  onClick(event: MouseEvent): void;
};
```

### `getLabelProps`

Returns the props to attach to the label.

```ts
type GetLabelProps = (props?: {
  [key: string]: unknown;
}) => {
  htmlFor: string;
  id: string;
};
```

### `getMenuProps`

Returns the props to attach to the menu.

```ts
type GetMenuProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-labelledby': string;
  id: string;
};
```

### `setHighlightedIndex`

> `(value: number | null) => void`

Sets the currently highlighted item index. Pass `null` to unselect items.

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

### `setContext`

> `(value: object) => void`

Sets the context passed in the lifecycle hooks.

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

      return [
        // ...
      ];
    });
  },
});
```
