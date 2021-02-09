---
id: debugging
title: Debugging
---

Learn about browser-based debugging strategies for Autocomplete.

## Using `debug` mode to inspect panel elements

Setting the [`debug`](autocomplete-js/#debug) option to `true` keeps the panel open when inspecting elements in your browser DevTools. This option defaults to `false`, meaning that the autocomplete panel closes when the [blur event](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) occurs. You should only use this option during development.

## Emulating a focused page in Chrome DevTools

You can enable the "Emulate a focused page" option from [Chrome DevTools](https://twitter.com/ChromeDevTools) to keep the autocomplete panel open when inspecting the DOM.

![DevTools Rendering options](/img/emulate-a-focused-page.png)

You can also access this option by hitting <kbd>⌘ Cmd</kbd>+<kbd>⇧ Shift</kbd>+<kbd>P</kbd> and searching for it.

![DevTools Rendering options](/img/emulate-a-focused-page-dropdown.png)

## Help and discussion

If you're having trouble implementing Autocomplete, or have questions or feature requests, please reach out on [GitHub Discussions](https://github.com/algolia/autocomplete.js/discussions/new). You're also welcome to engage with community members in our [forum](https://discourse.algolia.com/tag/autocomplete).
