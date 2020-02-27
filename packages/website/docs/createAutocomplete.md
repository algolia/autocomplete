---
id: createAutocomplete
---

The function to get the methods to create an autocomplete experience.

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
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
  getEnvironmentProps,
  getRootProps,
  getFormProps,
  getInputProps,
  getItemProps,
  getLabelProps,
  getMenuProps,
} = createAutocomplete(options);
```
