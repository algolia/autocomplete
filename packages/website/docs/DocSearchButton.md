---
id: DocSearchButton
---

This component displays the DocSearch button that opens the modal.

# Example

```js
import React from 'react';
import { createPortal } from 'react-dom';
import { DocSearchButton, DocSearchModal } from '@docsearch/react';

function App({ apiKey, indexName }) {
  const [isShowing, setIsShowing] = React.useState(false);

  return (
    <div>
      <header>
        <DocSearchButton onClick={() => setIsShowing(true)} />
      </header>

      {isShowing &&
        createPortal(
          <DocSearchModal
            apiKey={apiKey}
            indexName={indexName}
            onClose={() => setIsShowing(false)}
          />,
          document.body
        )}
    </div>
  );
}
```

# Reference

### `onClick`

> `() => void`

Function to call to open the DocSearch modal.
