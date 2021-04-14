---
id: basic-options
title: Basic configuration options
---

Everything you need to create fantastic autocomplete experiences.

We've built Autocomplete to give you unlimited flexibility while freeing you from having to think about things like keyboard navigation, accessibility, or UI state. **The library offers a wide variety of APIs to let you fully customize the behavior and rendering of your autocomplete.**

Yet, only two parameters are required to create an autocomplete:
- The **container** you want your autocomplete to go in.
- The **sources** from which to get the items to display (see more in [**Sources**](sources)).

```js title="JavaScript"
import { autocomplete } from '@algolia/autocomplete-js';

autocomplete({
  container: '#autocomplete',
  getSources() {
    return [
      {
        sourceId: 'links',
        getItems({ query }) {
          const items = [
            { label: 'Twitter', url: 'https://twitter.com' },
            { label: 'GitHub', url: 'https://github.com' },
          ];

          return items.filter(({ label }) =>
            label.toLowerCase().includes(query.toLowerCase())
          );
        },
        getItemUrl({ item }) {
          return item.url;
        },
        templates: {
          item({ item }) {
            return item.label;
          },
        },
      },
    ];
  },
});
```

The `container` options refers to where to inject the autocomplete in your HTML. It can be a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). Make sure to provide a container (e.g., a `div`), not an `input`. Autocomplete generates a fully accessible search box for you.

```html title="HTML"
<div id="autocomplete"></div>
```

This is all you need to build a [fully functional, accessible, keyboard-navigable autocomplete](https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/starter?file=/app.tsx).

Now, this is a great start, but **you can go much further**. Here are some of the options you'll probably want to use next:
- Use [`placeholder`](autocomplete-js#placeholder) to define the text that appears in the input before the user types anything.
- Use [`autoFocus`](autocomplete-js#autofocus) to focus on the search box on page load, and [`openOnFocus`](autocomplete-js#openonfocus) to display items as soon as a user selects the autocomplete, even without typing.
- Use the [`onStateChange`](autocomplete-js#onstatechange) lifecycle hook to execute code whenever the state changes.
- Use [`debug: true`](autocomplete-js#debug) to keep the autocomplete panel open even when the blur event occurs (see [**Debugging**](debugging)).

For a full list of all available parameters, check out the [API reference](autocomplete-js).
