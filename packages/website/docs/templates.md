---
id: templates
title: Displaying items with Templates
---

Templates let you customize the display of your autocomplete's items.

Once you've set up your [data sources](sources), you need to define how they display in your autocomplete experience. It encompasses the structure for each item and the way they look.

Autocomplete provides a Templates API to let you fully customize the render of each item.

## Usage

### Rendering each item

The rendering system of Autocomplete uses an agnostic virtual DOM implementation. You can return anything from each template as long as they're valid virtual DOM elements (VNodes).

For example, templates can return a string:

```js
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  getSources() {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return `Result: ${item.name}`;
          },
        },
      },
    ];
  },
});
```

Or a [Preact](https://preactjs.com/) component:

```js
/** @jsx h */
import { h } from 'preact';
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  getSources() {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return <div>{item.name}</div>;
          },
        },
      },
    ];
  },
});
```

::: info

Autocomplete uses [Preact 10](https://preactjs.com/guide/v10/whats-new/) to render templates by default. It isn't compatible with earlier versions.

:::

### Returning HTML

Native HTML elements aren't valid VNodes, which means you can't return a template string that contains HTML, or an HTML element. But if you're not using a virtual DOM implementation in your app, there are still two ways you can return HTML.

#### Using `dangerouslySetInnerHTML`

Each template function provides access to `createElement` and `Fragment` to create VNodes.

```js
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  getSources() {
    return [
      {
        // ...
        templates: {
          item({ item, createElement, Fragment }) {
            return createElement(Fragment, {}, item.name);
          },
        },
      },
    ];
  },
});
```

By default, `createElement` and `Fragment` default to [Preact](https://preactjs.com/)'s `Preact.createElement` (or `h`) and `preact.Fragment`. You can customize these and provide the virtual DOM implementation you prefer.

#### Using the `htm` library

If you're not using a transpiler to build your app, you can still use Autocomplete with the [htm](https://github.com/developit/htm) library, which lets you use a JSX-like syntax directly in the browser.

```js
import { html } from 'htm/preact';
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  // ...
  getSources() {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return html`<div>${item.name}</div>`
          },
        },
      },
    ];
  },
});
```

### Rendering a header and footer

In addition to rendering items, you can customize what to display before and after the list of items using the `header` and `footer` templates.

```js
autocomplete({
  // ...
  getSources({ query }) {
    return [
      {
        // ...
        templates: {
          header() {
            return 'Suggestions';
          },
          item({ item }) {
            return `Result: ${item.name}`;
          },
          footer() {
            return 'Footer';
          },
        },
      },
    ];
  },
});
```

### Styling items

Since you're fully controlling the rendered HTML, you can style it the way you want or use any class-based CSS library.

For example, if you're using [Bootstrap](https://getbootstrap.com/):

```js
/** @jsx h */
import { h } from 'preact';
import { autocomplete } from '@algolia/autocomplete-js';

import 'https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap.min.css';

autocomplete({
  // ...
  getSources() {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return <li class="list-group-item">{item.name}</li>;
          },
        },
      },
    ];
  },
});
```

Or [Tailwind CSS](https://tailwindcss.com/):

```js
/** @jsx h */
import { h } from 'preact';
import { autocomplete } from '@algolia/autocomplete-js';

import 'https://unpkg.com/tailwindcss@latest/dist/tailwind.min.css';

autocomplete({
  // ...
  getSources() {
    return [
      {
        // ...
        templates: {
          item({ item }) {
            return (
              <li class="py-2 px-4 rounded-sm border border-gray-200">
                {item.name}
              </li>
            );
          },
        },
      },
    ];
  },
});
```

:::note

Autocomplete also provides an [optional default theme](#).

:::

## Reference

### `templates`

> `AutocompleteTemplate`

A set of templates to customize how items are displayed. You can also provide templates for header and footer elements around the list of items.

You must define `templates` within your [sources](sources).
