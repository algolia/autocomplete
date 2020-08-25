---
id: DocSearch
---

This component displays the DocSearch button that opens the search modal.

## Example

```js
import React from 'react';
import { DocSearch } from '@docsearch/react';

import '@docsearch/react/style';

function App({ apiKey, indexName }) {
  return (
    <div>
      <DocSearch apiKey={apiKey} indexName={indexName} />
    </div>
  );
}
```

## Props

import DocSearchProps from './partials/docsearch-props.md'

<DocSearchProps />
