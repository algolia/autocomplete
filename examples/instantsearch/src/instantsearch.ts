import instantsearch from 'instantsearch.js';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import historyRouter from 'instantsearch.js/es/lib/routers/history';
import {
  configure,
  hierarchicalMenu,
  hits,
  pagination,
  panel,
} from 'instantsearch.js/es/widgets';

import { debounce } from '../src/debounce';
import { searchClient } from '../src/searchClient';

export const INSTANT_SEARCH_INDEX_NAME = 'instant_search';
export const INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE =
  'hierarchicalCategories.lvl0';

const instantSearchRouter = historyRouter();

export const search = instantsearch({
  searchClient,
  indexName: INSTANT_SEARCH_INDEX_NAME,
  routing: instantSearchRouter,
});
const virtualSearchBox = connectSearchBox(() => {});
const hierarchicalMenuWithHeader = panel({
  templates: { header: 'Categories' },
})(hierarchicalMenu);

search.addWidgets([
  configure({
    attributesToSnippet: ['name:7', 'description:15'],
    snippetEllipsisText: '…',
  }),
  // Mount a virtual search box to manipulate InstantSearch's `query` UI
  // state parameter.
  virtualSearchBox(),
  hierarchicalMenuWithHeader({
    container: '#categories',
    attributes: [
      INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE,
      'hierarchicalCategories.lvl1',
    ],
  }),
  hits({
    container: '#hits',
    transformItems(items) {
      return items.map((item) => ({
        ...item,
        category: item.categories[0],
        comments: (item.popularity % 100).toLocaleString(),
        sale: item.free_shipping,
        // eslint-disable-next-line @typescript-eslint/camelcase
        sale_price: item.free_shipping
          ? (item.price - item.price / 10).toFixed(2)
          : item.price.toString(),
      }));
    },
    templates: {
      item: (hit, { html, components }) => html`
        <article class="hit">
          <div class="hit-image">
            <img src="${hit.image}" alt="${hit.name}" />
          </div>
          <div>
            <h1>${components.Snippet({ hit, attribute: 'name' })}</h1>
            <div>
              By <strong>${hit.brand}</strong> in
              <strong>${hit.category}</strong>
            </div>
          </div>

          <div
            style="
              display: grid;
              grid-auto-flow: column;
              justify-content: start;
              align-items: center;
              gap: 8px;
            "
          >
            ${hit.rating > 0 &&
            html`
              <div
                style="
                  display: grid;
                  grid-auto-flow: column;
                  justify-content: start;
                  align-items: center;
                  gap: 4px;
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#e2a400"
                  stroke="#e2a400"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
                ${hit.rating}
              </div>
            `}

            <div
              style="
                display: grid;
                grid-auto-flow: column;
                justify-content: start;
                align-items: center;
                gap: 4px;
              "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="
                  position: relative;
                  top: 1px;
                "
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                ></path>
              </svg>
              <span>${hit.comments}</span>
            </div>
          </div>
        </article>
      `,
    },
  }),
  pagination({
    container: '#pagination',
    padding: 2,
    showFirst: false,
    showLast: false,
  }),
]);

// Set the InstantSearch index UI state from external events.
export function setInstantSearchUiState(indexUiState) {
  search.setUiState((uiState) => ({
    ...uiState,
    [INSTANT_SEARCH_INDEX_NAME]: {
      ...uiState[INSTANT_SEARCH_INDEX_NAME],
      // We reset the page when the search state changes.
      page: 1,
      ...indexUiState,
    },
  }));
}

export const debouncedSetInstantSearchUiState = debounce(
  setInstantSearchUiState,
  500
);

// Get the current category from InstantSearch.
export function getInstantSearchCurrentCategory() {
  const indexUiState = search.getUiState()[INSTANT_SEARCH_INDEX_NAME];
  const hierarchicalMenuUiState = indexUiState && indexUiState.hierarchicalMenu;
  const currentCategories =
    hierarchicalMenuUiState &&
    hierarchicalMenuUiState[INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTE];

  return currentCategories && currentCategories[0];
}

// Build URLs that InstantSearch understands.
export function getInstantSearchUrl(indexUiState) {
  return search.createURL({ [INSTANT_SEARCH_INDEX_NAME]: indexUiState });
}

// Return the InstantSearch index UI state.
export function getInstantSearchUiState() {
  const uiState = instantSearchRouter.read();

  return (uiState && uiState[INSTANT_SEARCH_INDEX_NAME]) || {};
}
