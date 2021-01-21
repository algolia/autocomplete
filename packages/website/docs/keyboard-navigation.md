---
id: keyboard-navigation
title: Integrating keyboard navigation
---

The Navigator API redirects users when opening a suggestion using their keyboard.

**Keyboard navigation is essential to a satisfying autocomplete experience.** This is one of the most important aspects of web accessibility: users should be able to interact with an autocomplete without using a mouse or trackpad.

Autocomplete provides keyboard accessibility out of the box and lets you define how to navigate to results without leaving the keyboard.

The Navigator API defines three navigation schemes based on key combinations:

- **In the current tab** when hitting <kbd>Enter</kbd>
- **In a new tab** when hitting <kbd>⌘ Cmd</kbd>+<kbd>Enter</kbd> or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>
- **In a new window** when hitting <kbd>⇧ Shift</kbd>+<kbd>Enter</kbd>

## Usage

To activate keyboard navigation, you need to implement a [`getItemUrl`](createAutocomplete#getitemurl) function in each of your [sources](/docs/sources) to provide the URL to navigate to. It tells the Navigator API which link to open on <kbd>Enter</kbd>.

```js {6-8}
autocomplete({
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
  // Default Navigator API implementation
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

By default, the Navigator API uses the [`Location`](https://developer.mozilla.org/en-US/docs/Web/API/Location) API (see default implementation above). If you're relying on native document-based routing, this should work out of the box. If you're using custom client-side routing, you can use the Navigator API to connect your autocomplete with it.

For example, if you're using Autocomplete in a [Gatsby](https://www.gatsbyjs.org/) website, you can leverage their [`navigate`](https://www.gatsbyjs.org/docs/gatsby-link/) helper to navigate to internal pages without refreshing the page.

```js
import { navigate } from 'gatsby';
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  navigator: {
    navigate({ itemUrl }) {
      navigate(itemUrl);
    },
  },
});
```

## Reference

Autocomplete merges the provided parameters with the default configuration, so you can only rewrite what you need.

### `navigate`

> `(params: { itemUrl: string, item: TItem, state: AutocompleteState<TItem> }) => void`

The function called when a URL should open in the current page.

This is triggered on <kbd>Enter</kbd>.

### `navigateNewTab`

> `(params: { itemUrl: string, item: TItem, state: AutocompleteState<TItem> }) => void`

The function called when a URL should open in a new tab.

This is triggered on <kbd>⌘ Cmd</kbd>+<kbd>Enter</kbd> or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.

### `navigateNewWindow`

> `(params: { itemUrl: string, item: TItem, state: AutocompleteState<TItem> }) => void`

The function called when a URL should open in a new window.

This is triggered on <kbd>⇧ Shift</kbd>+<kbd>Enter</kbd>.
