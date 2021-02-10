---
id: upgrading
title: Upgrading
---

Upgrade from Autocomplete v0 to Autocomplete v1.

import Draft from './partials/draft.md'

<Draft />

Autocomplete v1 offers a lot of new features that are explained in [**Core concepts**](basic-options).

## Import

```js
// Before
import autocomplete from 'autocomplete.js';

// After
import { autocomplete } from '@algolia/autocomplete-js';
```

## Params

Here's a list of params that will help you upgrade to from [Autocomplete v0](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#global-options) to v1:

- `autocomplete('#autocomplete', /* ... */)` → `autocomplete({ container: '#autocomplete', /* ... */ })`
- `autoselect: true` → `defaultSelectedItemId: 0`
- `autoselectOnBlur` is not needed anymore
- `tabAutocomplete` is not supported because we implement the ARIA 1.1 form of the [combobox design pattern](https://www.w3.org/TR/wai-aria-practices/#combobox)
- `hint` is not supported
- `clearOnSelected` is now local to the [source](sources): `getItemInputValue: () => ''`
- `dropdownMenuContainer` → `panelContainer`
- `templates` (top-level) → `render` and `renderEmpty`
- `cssClasses` → `classNames` where properties have changed
- `keyboardShortcuts` is not supported as an option
- `minLength` is replaced by only `openOnFocus` (which sets the minimum query length to either 0 or 1)

## Datasets

[Datasets](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#datasets) are replaced by the `getSources` function.

Learn more about [**Sources**](sources).

## Sources

[Sources](https://github.com/algolia/autocomplete.js/blob/45fa32d008620cf52bf4a90530be338543dfba7f/README.md#sources) are replaced by [`getItems`](sources#getitems).

## Templates

The `suggestion` template is renamed [`item`](templates#item).

Learn more about [**Templates**](templates).

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
