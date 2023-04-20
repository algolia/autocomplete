/** @jsxRuntime classic */
/** @jsx h */
import {
  autocomplete,
  AutocompleteComponents,
  getAlgoliaResults,
  getAlgoliaFacets,
  AutocompleteInsightsApi,
} from '@algolia/autocomplete-js';
import { createTagsPlugin, Tag } from '@algolia/autocomplete-plugin-tags';
import algoliasearch from 'algoliasearch/lite';
import { h, Fragment, render } from 'preact';
import groupBy from 'ramda/src/groupBy';

import '@algolia/autocomplete-theme-classic';

import { ProductHit, TagExtraData } from './types';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const searchClient = algoliasearch(appId, apiKey);

const tagsPlugin = createTagsPlugin<TagExtraData>({
  getTagsSubscribers() {
    return [
      {
        sourceId: 'brands',
        getTag({ item }) {
          return item;
        },
      },
      {
        sourceId: 'categories',
        getTag({ item }) {
          return item;
        },
      },
    ];
  },
  transformSource() {
    return undefined;
  },
  onChange({ tags }) {
    requestAnimationFrame(() => {
      const container = document.querySelector('.aa-InputWrapperPrefix');
      const oldTagsContainer = document.querySelector('.aa-Tags');

      const tagsContainer = document.createElement('div');
      tagsContainer.classList.add('aa-Tags');

      render(
        <div className="aa-TagsList">
          {tags.map((tag) => (
            <TagItem key={tag.label} {...tag} />
          ))}
        </div>,
        tagsContainer
      );

      if (oldTagsContainer) {
        container.replaceChild(tagsContainer, oldTagsContainer);
      } else {
        container.appendChild(tagsContainer);
      }
    });
  },
});

type TagItemProps<TTag> = Tag<TTag>;

function TagItem<TTag>({ label, remove }: TagItemProps<TTag>) {
  return (
    <div className="aa-Tag">
      <span className="aa-TagLabel">{label}</span>
      <button
        className="aa-TagRemoveButton"
        onClick={() => remove()}
        title="Remove this tag"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M18 6L6 18"></path>
          <path d="M6 6L18 18"></path>
        </svg>
      </button>
    </div>
  );
}

autocomplete<ProductHit | Tag<TagExtraData>>({
  container: '#autocomplete',
  placeholder: 'Search',
  openOnFocus: true,
  insights: true,
  plugins: [tagsPlugin],
  detachedMediaQuery: 'none',
  getSources({ query, state }) {
    const tagsByFacet = groupBy<Tag<TagExtraData>>(
      (tag) => tag.facet,
      state.context.tagsPlugin.tags
    );

    return [
      {
        sourceId: 'brands',
        onSelect({ item, state, setQuery }) {
          if (
            item.label.toLowerCase().includes(state.query.toLowerCase().trim())
          ) {
            setQuery('');
          }
        },
        getItems({ query }) {
          return getAlgoliaFacets({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                facet: 'brand',
                params: {
                  facetQuery: query,
                  maxFacetHits: 3,
                  filters: mapToAlgoliaNegativeFilters(
                    state.context.tagsPlugin.tags,
                    ['brand']
                  ),
                },
              },
            ],
            transformResponse({ facetHits }) {
              return facetHits[0].map((hit) => ({ ...hit, facet: 'brand' }));
            },
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Brands</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return (
              <div className="aa-ItemWrapper">
                <div className="aa-ItemContent">
                  <div className="aa-ItemContentBody">
                    <div className="aa-ItemContentTitle">
                      Filter on{' '}
                      <components.Highlight hit={item} attribute="label" />
                    </div>
                  </div>
                </div>
                <div className="aa-ItemActions">
                  <button
                    className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                    type="button"
                    title={`Filter on ${item.label}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          },
          noResults() {
            return 'No brands for this query.';
          },
        },
      },
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults<ProductHit>({
            searchClient,
            queries: [
              {
                indexName: 'instant_search',
                query,
                params: {
                  attributesToSnippet: ['name:10'],
                  snippetEllipsisText: '…',
                  filters: mapToAlgoliaFilters(tagsByFacet),
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Products</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return (
              <ProductItem
                hit={item}
                components={components}
                insights={state.context.algoliaInsightsPlugin.insights}
              />
            );
          },
          noResults() {
            return 'No products for this query.';
          },
        },
      },
    ];
  },
});

type ProductItemProps = {
  hit: ProductHit;
  insights: AutocompleteInsightsApi;
  components: AutocompleteComponents;
};

function ProductItem({ hit, insights, components }: ProductItemProps) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={hit.image} alt={hit.name} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Snippet hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            From <strong>{hit.brand}</strong> in{' '}
            <strong>{hit.categories[0]}</strong>
          </div>
          {hit.rating > 0 && (
            <div className="aa-ItemContentDescription">
              <div style={{ display: 'flex', gap: 1, color: '#ffc107' }}>
                {Array.from({ length: 5 }, (_value, index) => {
                  const isFilled = hit.rating >= index + 1;

                  return (
                    <svg
                      key={index}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isFilled ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  );
                })}
              </div>
            </div>
          )}
          <div className="aa-ItemContentDescription" style={{ color: '#000' }}>
            <strong>${hit.price.toLocaleString()}</strong>
          </div>
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
          type="button"
          title="Select"
          style={{ pointerEvents: 'none' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
        <button
          className="aa-ItemActionButton"
          type="button"
          title="Add to cart"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            insights.convertedObjectIDsAfterSearch({
              eventName: 'Added to cart',
              index: hit.__autocomplete_indexName,
              items: [hit],
              queryID: hit.__autocomplete_queryID,
            });
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 5h-14l1.5-2h11zM21.794 5.392l-2.994-3.992c-0.196-0.261-0.494-0.399-0.8-0.4h-12c-0.326 0-0.616 0.156-0.8 0.4l-2.994 3.992c-0.043 0.056-0.081 0.117-0.111 0.182-0.065 0.137-0.096 0.283-0.095 0.426v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.219-0.071-0.422-0.189-0.585-0.004-0.005-0.007-0.010-0.011-0.015zM4 7h16v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707zM15 10c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121c0-0.552-0.448-1-1-1s-1 0.448-1 1c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
          </svg>
        </button>
      </div>
    </a>
  );
}

const searchInput: HTMLInputElement = document.querySelector(
  '.aa-Autocomplete .aa-Input'
);

searchInput.addEventListener('keydown', (event) => {
  if (
    event.key === 'Backspace' &&
    searchInput.selectionStart === 0 &&
    searchInput.selectionEnd === 0
  ) {
    const newTags = tagsPlugin.data.tags.slice(0, -1);
    tagsPlugin.data.setTags(newTags);
  }
});

function mapToAlgoliaFilters(
  tagsByFacet: Record<string, Array<Tag<TagExtraData>>>,
  operator = 'AND'
) {
  return Object.keys(tagsByFacet)
    .map((facet) => {
      return `(${tagsByFacet[facet]
        .map(({ label }) => `${facet}:"${label}"`)
        .join(' OR ')})`;
    })
    .join(` ${operator} `);
}

function mapToAlgoliaNegativeFilters(
  tags: Array<Tag<TagExtraData>>,
  facetsToNegate: string[],
  operator = 'AND'
) {
  return tags
    .map(({ label, facet }) => {
      const filter = `${facet}:"${label}"`;

      return facetsToNegate.includes(facet) && `NOT ${filter}`;
    })
    .filter(Boolean)
    .join(` ${operator} `);
}
