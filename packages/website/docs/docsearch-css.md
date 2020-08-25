---
id: docsearch-css
title: '@docsearch/css'
---

This package contains the styles for DocSearch.

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

## Files

```sh
@docsearch/css
├── dist/style.css # all styles
├── dist/_variables.css # CSS variables
├── dist/button.css # CSS for the button
└── dist/modal.css # CSS for the modal
```

You can load the partial styles to lazy load the modal style only when required.
