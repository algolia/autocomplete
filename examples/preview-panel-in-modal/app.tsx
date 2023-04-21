/** @jsxRuntime classic */
/** @jsx h */
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import algoliasearch from 'algoliasearch/lite';
import { h, render } from 'preact';

import '@algolia/autocomplete-theme-classic';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

autocomplete({
  container: '#autocomplete',
  detachedMediaQuery: '',
  defaultActiveItemId: 0,
  insights: true,
  getSources() {
    return [
      {
        sourceId: 'hits',
        getItems({ query }) {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  hitsPerPage: 8,
                },
              },
            ],
          });
        },
        getItemUrl({ item }) {
          return item.url;
        },
        onActive({ item, setContext }) {
          setContext({ preview: item });
        },
        templates: {
          item({ item, components }) {
            return (
              <a className="aa-ItemLink" href={item.url}>
                <div className="aa-ItemContent">
                  <div className="aa-ItemIcon">
                    <img
                      src={item.image}
                      alt={item.name}
                      width="40"
                      height="40"
                    />
                  </div>
                  <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                      <components.Highlight hit={item} attribute="name" />
                    </div>
                  </div>
                </div>
              </a>
            );
          },
        },
      },
      {
        sourceId: 'suggestions',
        getItems({ query }) {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'instantsearch_query_suggestions',
                query,
                params: {
                  hitsPerPage: 4,
                },
              },
            ],
          });
        },
        onSelect({ item, setQuery, setIsOpen, refresh }) {
          setQuery(`${item.query} `);
          setIsOpen(true);
          refresh();
        },
        templates: {
          header({ Fragment }) {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">
                  Can't find what you're looking for?
                </span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return (
              <div className="aa-QuerySuggestion">
                <components.ReverseHighlight hit={item} attribute="query" />
              </div>
            );
          },
        },
      },
    ];
  },
  render({ children, state, Fragment, components }, root) {
    const { preview } = state.context;

    render(
      <Fragment>
        <div className="aa-Grid">
          <div className="aa-Results aa-Column">{children}</div>
          <div className="aa-Preview aa-Column">
            <div className="aa-PreviewImage">
              <img src={preview.image} alt={preview.name} />
            </div>
            <div className="aa-PreviewTitle">
              <components.Highlight hit={preview} attribute="name" />
            </div>
            <div className="aa-PreviewPrice">${preview.price}</div>
            <div className="aa-PreviewDescription">
              <components.Highlight hit={preview} attribute="description" />
            </div>
          </div>
        </div>
      </Fragment>,
      root
    );
  },
});
