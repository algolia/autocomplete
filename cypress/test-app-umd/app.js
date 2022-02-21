const { algoliasearch } = window;
const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];
const { createQuerySuggestionsPlugin } = window[
  '@algolia/autocomplete-plugin-query-suggestions'
];

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'instant_search_demo_query_suggestions',
});

autocomplete({
  container: '#autocomplete',
  placeholder: 'Search',
  getSources({ query }) {
    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
              },
            ],
          });
        },
        templates: {
          item({ item, components, createElement }) {
            return createElement(
              'div',
              {
                className: 'aa-ItemWrapper',
              },
              createElement(
                'div',
                { className: 'aa-ItemContent' },
                createElement(
                  'div',
                  {
                    className:
                      'aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop',
                  },
                  createElement('img', {
                    src: item.image,
                    alt: item.name,
                    width: 40,
                    height: 40,
                  })
                ),
                createElement(
                  'div',
                  { className: 'aa-ItemContentBody' },
                  createElement(
                    'div',
                    { className: 'aa-ItemContentTitle' },
                    components.Snippet({ hit: item, attribute: 'name' })
                  ),
                  createElement(
                    'div',
                    { className: 'aa-ItemContentDescription' },
                    components.Snippet({ hit: item, attribute: 'description' })
                  )
                )
              )
            );
          },
          noResults() {
            return 'No products matching.';
          },
        },
      },
    ];
  },
  plugins: [querySuggestionsPlugin],
});
