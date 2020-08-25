### `apiKey`

> `string` | **required**

The Algolia search-only API key.

### `indexName`

> `string` | **required**

The Algolia index name.

### `appId`

> `string` | defaults to `"BH4D9OD16A"`

The Algolia application ID.

### `placeholder`

> `string` | defaults to `"Search docs"`

The text that appears in the search box input when there is no query.

### `searchParameters`

> `SearchParameters`

[Search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/) to forward to Algolia.

### `initialQuery`

> `string`

The initial query when the modal opens.

### `transformItems`

> `(items: DocSearchHit[]) => DocSearchHit[]`

Function to customize the hits before rendering them.

### `transformSearchClient`

> `(searchClient: SearchClient) => SearchClient`

Function to transform the [Algolia search client](https://github.com/algolia/algoliasearch-client-javascript). It can be useful to alter or proxy requests.

### `hitComponent`

> `(props: { hit: DocSearchHit; children: React.ReactNode; }): JSX.Element`

The component to use for a hit. It's useful to use a custom link component, or to customize the hits to display.

It defaults to:

```js
function Hit({ hit, children }) {
  return <a href={hit.url}>{children}</a>;
}
```

### `navigator`

> `Navigator`

[Navigator API](/docs/keyboard-navigation) to redirect the user when a link should be opened.

### `disableUserPersonalization`

> `boolean` | defaults to `false`

Whether to disable all personalized features: recent searches, favorite searches.
