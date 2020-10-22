---
id: keyboard-navigation
title: Keyboard Navigation
---

The Navigator API is used to redirect users when a suggestion link is opened programmatically using keyboard navigation.

This API defines how a URL should be opened with different key modifiers:

- **In the current tab** triggered on <kbd>Enter</kbd>
- **In a new tab** triggered on <kbd>⌘ Enter</kbd> or <kbd>Ctrl Enter</kbd>
- **In a new window** triggered on <kbd>⇧ Enter</kbd>

<!-- prettier-ignore -->
:::important
To activate keyboard navigation, use [`getItemUrl`](createAutocomplete#getitemurl) in your source to provide the value to process as a URL. This indicates the navigator API which links to open on <kbd>Enter</kbd>.
:::

# Example

```js {6-8}
const autocomplete = createAutocomplete({
  // ...
  getSources() {
    return [
      {
        getItemUrl({ item }) {
          return item.url;
        },
        getSuggestions() {
          return [];
        },
      },
    ];
  },
  // Default navigator values
  navigator: {
    navigate({ suggestionUrl }) {
      window.location.assign(suggestionUrl);
    },
    navigateNewTab({ suggestionUrl }) {
      const windowReference = window.open(suggestionUrl, '_blank', 'noopener');

      if (windowReference) {
        windowReference.focus();
      }
    },
    navigateNewWindow({ suggestionUrl }) {
      window.open(suggestionUrl, '_blank', 'noopener');
    },
  },
});
```

If you use autocomplete in a [Gatsby](https://www.gatsbyjs.org/) website, you can leverage their [`navigate`](https://www.gatsbyjs.org/docs/gatsby-link/) API to avoid hard refreshes.

```js
import { navigate } from 'gatsby';

const autocomplete = createAutocomplete({
  navigator: {
    navigate({ suggestionUrl }) {
      navigate(suggestionUrl);
    },
  },
});
```

# Reference

## Params

The provided params get merged with the default configuration so that you don't have to rewrite all methods.

### `navigate`

> `(params: { suggestionUrl: string, suggestion: TItem, state: AutocompleteState<TItem> }) => void`

Function called when a URL should be open in the current page.

This is triggered on <kbd>Enter</kbd>

### `navigateNewTab`

> `(params: { suggestionUrl: string, suggestion: TItem, state: AutocompleteState<TItem> }) => void`

Function called when a URL should be open in a new tab.

This is triggered on <kbd>Cmd Enter</kbd> or <kbd>Ctrl Enter</kbd>

### `navigateNewWindow`

> `(params: { suggestionUrl: string, suggestion: TItem, state: AutocompleteState<TItem> }) => void`

Function called when a URL should be open in a new window.

This is triggered on <kbd>Shift Enter</kbd>
