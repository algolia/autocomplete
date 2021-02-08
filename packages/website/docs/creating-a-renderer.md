---
id: creating-a-renderer
title: Creating a Renderer
---

Learn how to build a autocomplete UI using React.

The `@algolia/autocomplete-core` package provides all the primitives to build an autocomplete experience, but you remain in charge of the UI output. This page will teach you how to leverage all the autocomplete capacities to build an accessible autocomplete, both for desktop and mobile.

You can find the final result in [this sandbox](https://codesandbox.io/s/github/algolia/autocomplete.js/tree/next/examples/react-renderer?file=/src/Autocomplete.tsx).

## Importing the package

We'll import [`createAutocomplete`](createAutocomplete) from the core package and [`getAlgoliaHits`](getAlgoliaHits) from the Algolia preset which is a utility function to retrieve suggestions from an Algolia index.

```js
import algoliasearch from 'algoliasearch/lite';
import { createAutocomplete } from '@algolia/autocomplete-core';
import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

// ...
```

## Initializing Autocomplete

The Autocomplete entry point is the [`createAutocomplete`](createAutocomplete) function, which returns the methods to create the autocomplete experience.

```js
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

function Autocomplete() {
  // (1) Create a React state.
  const [autocompleteState, setAutocompleteState] = React.useState({});
  const autocomplete = React.useRef(
    createAutocomplete({
      onStateChange({ state }) {
        // (2) Synchronize the Autocomplete state with the React state.
        setAutocompleteState(state);
      },
      getSources() {
        return [
          // (3) Use an Algolia index source.
          {
            sourceId: 'querySuggestionsSource',
            getItemInputValue({ item }) {
              return item.query;
            },
            getItems({ query }) {
              return getAlgoliaHits({
                searchClient,
                queries: [
                  {
                    indexName: 'instant_search',
                    query,
                    params: {
                      hitsPerPage: 4,
                      highlightPreTag: '<mark>',
                      highlightPostTag: '</mark>',
                    },
                  },
                ],
              });
            },
            getItemUrl({ item }) {
              return item.url;
            },
          },
        ];
      },
    })
  ).current;

  // ...
}
```

- (1) We leverage a React state for our component to re-render when the [Autocomplete state](state) changes.

- (2) We listen to all Autocomplete state changes to synchronize them with the React state.

- (3) We use an Algolia index as a [source](sources).

We now have access to all the methods to use in our React components in the `autocomplete` variable. We can start building the UI.

## Using Prop Getters

[Prop getters](prop-getters) are methods that return props to use in your components. These props contain accessibility features, event handlers, etc. You do not have to know exactly what they're doing, since their responsibility is to create a complete experience without understanding the complex technical parts.

```jsx
function Autocomplete() {
  // ...

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <input className="aa-Input" {...autocomplete.getInputProps({})} />
      <div className="aa-Panel" {...autocomplete.getPanelProps({})}>
        {autocompleteState.isOpen &&
          autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              <section key={`source-${index}`} className="aa-Source">
                {items.length > 0 && (
                  <ul className="aa-List" {...autocomplete.getListProps()}>
                    {items.map((item) => (
                      <li
                        key={item.objectID}
                        className="aa-Item"
                        {...autocomplete.getItemProps({
                          item,
                          source,
                        })}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
      </div>
    </div>
  );
}
```

The above code demonstrates that you do not need to worry about keyboard events, or tracking which item is highlighted, Autocomplete handles it with its prop getters.

At this point, you should already have a usable autocomplete input:

![Image](https://user-images.githubusercontent.com/6137112/83744493-7f3b0d80-a65c-11ea-9daf-ff14888f6028.png)

## Improving the input accessibility

To improve the `input` control, we can wrap it in a `form` and apply the form props given by Autocomplete:

```js
function Autocomplete() {
  // ...
  const inputRef = React.useRef(null);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <input ref={inputRef} {...autocomplete.getInputProps({})} />
      </form>
      {/* ... */}
    </div>
  );
}
```

`getFormProps` will handle submit and reset events and will respectively blur and focus the input when these events happen. You need to pass the `inputElement` to `getFormProps` to leverage this functionality.

You can add a label that represents the input:

```js
function Autocomplete() {
  // ...
  const inputRef = React.useRef(null);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            Search
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({})}
          />
        </div>
      </form>
      {/* ... */}
    </div>
  );
}
```

A good practice for search inputs is to display a reset button. You can conditionally display it based on if there's a query.

```js
function Autocomplete() {
  // ...

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        <div className="aa-InputWrapperPrefix">
          <label className="aa-Label" {...autocomplete.getLabelProps({})}>
            Search
          </label>
        </div>
        <div className="aa-InputWrapper">
          <input
            className="aa-Input"
            ref={inputRef}
            {...autocomplete.getInputProps({})}
          />
        </div>
        <div className="aa-InputWrapperSuffix">
          <button className="aa-ResetButton" type="reset">
            ｘ
          </button>
        </div>
      </form>
      {/* ... */}
    </div>
  );
}
```

## Reacting to the network

You can display UI hints when the network is unstable, which can help users understand why results are not updating in real time.

```js
function Autocomplete() {
  // ...

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      {/* ... */}

      {autocompleteState.isOpen && (
        <div
          className={[
            'aa-Panel',
            autocompleteState.status === 'stalled' && 'aa-Panel--stalled',
          ]
            .filter(Boolean)
            .join(' ')}
          {...autocomplete.getPanelProps({})}
        >
          {/* ... */}
        </div>
      )}
      {/* ... */}
    </div>
  );
}
```

You could for example create a `.aa-Panel--stalled` CSS class that lowers the opacity to hint users that the search is currently stuck.

![Image](https://user-images.githubusercontent.com/6137112/83759558-034cbf80-a674-11ea-86ca-6728b4c2d6f7.png)

You can learn more about what's available in the [state](state).

## Enabling a native mobile experience

Native platforms offer better primitive for mobile search experiences than the web. Autocomplete aims at providing this extra layer for the web mobile experience to be as close as the native mobile experience.

A common feature in mobile native experiences is to close the virtual keyboard when the user starts scrolling. This makes the results more discoverable, without the user having to manually close the keyboard

The `getEnvironmentProps` method returns event handlers that let you create this experience.

```js
function Autocomplete() {
  // ...

  const inputRef = React.useRef(null);
  const formRef = React.useRef(null);
  const panelRef = React.useRef(null);

  const { getEnvironmentProps } = autocomplete;

  React.useEffect(() => {
    if (!(formRef.current && panelRef.current && inputRef.current)) {
      return;
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      formElement: formRef.current,
      panelElement: panelRef.current,
      inputElement: inputRef.current,
    });

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [getEnvironmentProps, formRef, panelRef, inputRef]);

  return (
    <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
      <form
        ref={formRef}
        className="aa-Form"
        {...autocomplete.getFormProps({ inputElement: inputRef.current })}
      >
        {/* ... */}
      </form>

      {autocompleteState.isOpen && (
        <div
          ref={panelRef}
          className={[
            'aa-Panel',
            autocompleteState.status === 'stalled' && 'aa-Panel--stalled',
          ]
            .filter(Boolean)
            .join(' ')}
          {...autocomplete.getPanelProps({})}
        >
          {/* ... */}
        </div>
      )}
    </div>
  );
}
```

Users will now feel a little bit closer to what they're used to on mobile apps.

---

You now have enough knowledge to build your own experience based on Autocomplete. If you feel like some topics weren't covered in this page, feel free to [open an issue](https://github.com/algolia/autocomplete.js/issues/new).
