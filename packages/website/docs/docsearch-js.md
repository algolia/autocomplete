---
id: docsearch-js
title: '@docsearch/js'
---

This package creates a DocSearch button that opens the DocSearch search modal.

## Example

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@docsearch/css@alpha"
    />
  </head>
  <body>
    <div id="docsearch"></div>

    <script src="https://cdn.jsdelivr.net/npm/@docsearch/js@alpha"></script>
    <script>
      docsearch({
        container: '#docsearch',
        apiKey: 'YOUR_API_KEY',
        indexName: 'YOUR_INDEX_NAME',
      });
    </script>
  </body>
</html>
```

## Options

### `container`

> `string | HTMLElement` | **required**

The container for the DocSearch button. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.

import DocSearchProps from './partials/docsearch-props.md'

<DocSearchProps />
