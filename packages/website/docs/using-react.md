---
id: using-react
title: Using Autocomplete with React
---

Learn how to create and use a React Autocomplete component.

This guide shows how to create a React Autocomplete component. It uses the [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) and [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hooks to create and mount the component. It doesn't define specific [sources](sources). Rather, you can pass [sources](sources) and other [options](basic-options) as [props](https://reactjs.org/docs/components-and-props.html).

## Prerequisites

This tutorial assumes that you have:

- an existing [React (v16.8+) application](https://reactjs.org/docs/getting-started.html) where you want to implement the autocomplete menu
- familiarity with the [basic Autocomplete configuration options](basic-options)

## Creating the component

Start with some boilerplate for creating a React component. This component uses the [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) hook to create a mutable ref object, `containerRef`, to mount the autocomplete on. To learn more about this hook, check out the [`useRef` React documentation](https://reactjs.org/docs/hooks-reference.html#useref).

All that you need to render is a `div` with the `containerRef` as the `ref`.

```jsx title="Autocomplete.jsx"
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

export function Autocomplete(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
  }, [props]);

  return <div ref={containerRef} />;
}
```

### Mounting the autocomplete

Now that you have access to the DOM through the `containerRef` object, you can create and mount the Autocomplete instance. Upon instantiation, you can include any desired [Autocomplete options](basic-options) and rely on `props` to pass any options you want to remain configurable.

The example component below sets only the [`container`](autocomplete-js/#container) option. It specifies where to mount your Autocomplete component, but lets all other [options](basic-options) get configured through props.

**You must also pass the `renderer` and `render` parameters.** This is because the default Autocomplete implementation uses [Preact's](https://preactjs.com/) version of `createElement`, `Fragment` and `render`. Without providing React's version of these, the Autocomplete instance won't render the views properly.

Don't forget to [clean up the effect](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect) by returning a function that destroys the Autocomplete instance.

```jsx title="Autocomplete.jsx"
import { autocomplete } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

export function Autocomplete(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children, root);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return <div ref={containerRef} />;
}
```

## Using the component

Now that you've created an `<Autocomplete />` component, you can use it in your React application.

The usage below sets [`openOnFocus`](autocomplete-js#openonfocus) and [sources](sources) through props. This example uses an [Algolia index](https://www.algolia.com/doc/faq/basics/what-is-an-index/) as a [source](sources), but you could use anything else you want, including [plugins](plugins). For more information on using Algolia as a source, check out the [Getting Started guide](getting-started).

```jsx title=App.jsx"
import React, { createElement } from 'react';
import { getAlgoliaHits } from 'autocomplete-js';
import algoliasearch from "algoliasearch";
import { Autocomplete } from './components/Autocomplete';
import { ProductItem } from './components/ProductItem';

const appId = "latency";
const apiKey = "6be0576ff61c053d5f9a3225e2a90f76";
const searchClient = algoliasearch(appId, apiKey);

function App() {
  return (
    <div className="app-container">
      <h1>React Application</h1>
      <Autocomplete
        openOnFocus={true}
        getSources={({ query }) =>
          [
            {
              getItems() {
                return getAlgoliaHits({
                  searchClient,
                  queries: [
                    {
                      indexName: "instant_search",
                      query,
                    }
                  ]
                });
              },
              templates: {
                item({ item }) {
                  return <ProductItem hit={item} />;
                }
              }
            }
          ];
        }
      />
    </div>
  );
}

export default App;
```

### Creating templates

The example above passes `<ProductItem />`, another React component, for the `item` [template](templates). When creating templates, there's one thing to keep in mind. If you're using the highlighting and snippeting utilities, you must pass them React's `createElement` function. Without doing this, the utilities default to `preact.createElement` and won't work properly.

The highlighting and snippeting utilities are:

- [`highlightHit`](highlighthit)
- [`snippetHit`](snippethit)
- [`reverseHighlightHit`](reversehighlighthit)
- [`reverseSnippetHit`](reversesnippethit)

Here's an example using [`highlightHit`](highlighthit):

```jsx title="ProductItem.jsx"
import { highlightHit } from '@algolia/autocomplete-js';
import React, { createElement } from 'react';

export function ProductItem({ hit }) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          {highlightHit({
            hit,
            attribute: 'name',
            createElement,
          })}
        </div>
      </div>
    </a>
  )
```

## Further UI customization

If you want to build a custom UI that differs from the `autocomplete-js` output, check out the [guide on creating a custom renderer](creating-a-renderer). This guide outlines how to create a custom React renderer specifically, but the underlying principles are the same for any other front-end framework.
