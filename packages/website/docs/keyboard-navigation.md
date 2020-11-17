---
id: keyboard-navigation
title: Keyboard Navigation
---

The Navigator API is used to redirect users when a suggestion link is opened programmatically using keyboard navigation.

This API defines how a URL should be opened with different key modifiers:

- **In the current tab** triggered on <kbd>Enter</kbd>
- **In a new tab** triggered on <kbd>⌘ Cmd</kbd>+<kbd>Enter</kbd> or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.
- **In a new window** triggered on <kbd>⇧ Shift</kbd>+<kbd>Enter</kbd>

<!-- prettier-ignore -->
:::important
To activate keyboard navigation, use [`getItemUrl`](createAutocomplete#getitemurl) in your source to provide the value to process as a URL. This indicates the navigator API which links to open on <kbd>Enter</kbd>.
:::

## Example

```js {6-8}
const autocomplete = createAutocomplete({
  // ...
  getSources() {
    return [
      {
        getItemUrl({ item }) {
          return item.url;
        },
        getItems() {
          return [];
        },
      },
    ];
  },
  // Default navigator values
  navigator: {
    navigate({ itemUrl }) {
      window.location.assign(itemUrl);
    },
    navigateNewTab({ itemUrl }) {
      const windowReference = window.open(itemUrl, '_blank', 'noopener');

      if (windowReference) {
        windowReference.focus();
      }
    },
    navigateNewWindow({ itemUrl }) {
      window.open(itemUrl, '_blank', 'noopener');
    },
  },
});
```

If you use autocomplete in a [Gatsby](https://www.gatsbyjs.org/) website, you can leverage their [`navigate`](https://www.gatsbyjs.org/docs/gatsby-link/) API to avoid hard refreshes.

```js
import { navigate } from 'gatsby';

const autocomplete = createAutocomplete({
  navigator: {
    navigate({ itemUrl }) {
      navigate(itemUrl);
    },
  },
});
```

## Params

The provided params get merged with the default configuration so that you don't have to rewrite all methods.

### `navigate`

> `(params: { itemUrl: string, item: TItem, state: AutocompleteState<TItem> }) => void`

Function called when a URL should be open in the current page.

This is triggered on <kbd>Enter</kbd>.

### `navigateNewTab`

> `(params: { itemUrl: string, item: TItem, state: AutocompleteState<TItem> }) => void`

Function called when a URL should be open in a new tab.

This is triggered on <kbd>⌘ Cmd</kbd>+<kbd>Enter</kbd> or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.

### `navigateNewWindow`

> `(params: { itemUrl: string, item: TItem, state: AutocompleteState<TItem> }) => void`

Function called when a URL should be open in a new window.

This is triggered on <kbd>⇧ Shift</kbd>+<kbd>Enter</kbd>.
