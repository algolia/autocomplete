---
id: upgrading
title: Upgrading
---

Learn how tp upgrade from Autocomplete v0 to Autocomplete v1.

Autocomplete v1 offers many new features that are explained in [**Core concepts**](basic-options). Please read this documentation to understand the new capabilities.

## Import

```js
// Before
import autocomplete from 'autocomplete.js';

// After
import { autocomplete } from '@algolia/autocomplete-js';
```

Read more about your [installation options](getting-started#installation) in the [guide on getting started](getting-started).

## Parameters

These parameters and how you use them have changed from [Autocomplete v0](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options):

| v0 | v1 |
| ----------- | ----------- |
| [`autocomplete('#autocomplete', /* ... */)`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | [`autocomplete({ container: '#autocomplete', /* ... */ })`](autocomplete-js/#container) |
| [`autoselect: true`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | `defaultSelectedItemId: 0` |
| [`autoselectOnBlur: true`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | No longer needed; this is the default behavior |
| [`tabAutocomplete: true`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | No longer supported; v1 implements the ARIA 1.1 form of the [combobox design pattern](https://www.w3.org/TR/wai-aria-practices/#combobox) |
| [`hint`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | No longer supported |
| [`clearOnSelected`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | This is now now local to the [source](sources): [`getItemInputValue: () => ''`](sources/#getiteminputvalue)|
| [`dropdownMenuContainer`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | [`panelContainer`](autocomplete-js/#panelcontainer) |
| [`templates`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) (top-level) | [`render`](autocomplete-js/#render) and [`renderEmpty`](autocomplete-js/#renderempty) |
| [`cssClasses`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | [`classNames`](autocomplete-js/#classnames) where properties have changed |
| [`keyboardShortcuts`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | No longer supported as an option; check out the [keyboard navigation docs](keyboard-navigation) |
| [`minLength : 0`](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) | [`openOnFocus : true`](autocomplete-js/#openonfocus)  |

## Datasets

[Datasets](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#datasets) are replaced by the [`getSources`](autocomplete-js/#getsources) function. Learn more about [**Sources** concept](sources).

## Sources

[Sources](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#sources) are replaced by [`getItems`](sources#getitems).

## Templates

The `suggestion` template is renamed [`item`](templates#item). Learn more about [**Templates** concept](templates).

## Top-level API

```js
// Before
const search = autocomplete(/* ... */);
search.autocomplete.open();
search.autocomplete.close();
search.autocomplete.getVal();
search.autocomplete.setVal('Query');
search.autocomplete.destroy();

// After
const search = autocomplete(/* ... */);
search.setIsOpen(true);
search.setIsOpen(false);
search.setQuery('Query');
search.destroy();
```
