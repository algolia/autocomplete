import { AutocompleteSource } from '@algolia/autocomplete-core';
import { autocomplete } from '@algolia/autocomplete-js';
import {
  getAlgoliaResults,
  RequestParams,
} from '@algolia/autocomplete-preset-algolia';
import { fireEvent, waitFor, within } from '@testing-library/dom';

import { createNavigator, createSearchClient } from '../../../../test/utils';
import { createRedirectUrlPlugin } from '../createRedirectUrlPlugin';

const SOURCE_ID = 'mock-source';
const REDIRECT_QUERY = 'redirect item';
const RESPONSE = {
  query: REDIRECT_QUERY,
  renderingContent: {
    redirect: {
      url: 'https://www.algolia.com',
    },
  },
};

function createMockSource({
  sourceId = SOURCE_ID,
  results = [RESPONSE],
  queries = [{ query: REDIRECT_QUERY, indexName: 'mock-index' }],
  ...props
}: {
  sourceId?: string;
  results?: Record<string, any>;
  queries?: RequestParams<any>['queries'];
} & Partial<AutocompleteSource<any>> = {}) {
  return {
    sourceId,
    getItems() {
      return getAlgoliaResults({
        searchClient: createSearchClient({
          search: jest.fn().mockResolvedValue({ results }),
        }),
        queries,
      });
    },
    templates: {
      item({ item, html }) {
        return html`<a>${item.query}</a>`;
      },
    },
    ...props,
  };
}

function findInput(container: HTMLElement) {
  return container.querySelector<HTMLInputElement>('.aa-Input') as HTMLElement;
}

function findRedirectSection(container: HTMLElement) {
  return container.querySelector(
    '[data-autocomplete-source-id="redirectUrlPlugin"]'
  ) as HTMLElement;
}

function findHitsSection(container: HTMLElement, sourceId = SOURCE_ID) {
  return container.querySelector(
    `[data-autocomplete-source-id="${sourceId}"]`
  ) as HTMLElement;
}

function findDropdownOptions(container: HTMLElement) {
  return within(container)
    .getAllByRole('option')
    .map((option) => option.children);
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createRedirectUrlPlugin', () => {
  test('has a name', () => {
    const plugin = createRedirectUrlPlugin();

    expect(plugin.name).toBe('aa.redirectUrlPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const plugin = createRedirectUrlPlugin({
      transformResponse: jest.fn(),
      templates: { item: () => 'hey' },
      onRedirect: jest.fn(),
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      transformResponse: expect.any(Function),
      templates: expect.any(Object),
      onRedirect: expect.any(Function),
    });
  });

  test('renders a redirect item when the default redirect payload is returned', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [createMockSource()];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });

    await waitFor(() => {
      expect(findHitsSection(panelContainer)).not.toBeInTheDocument();

      expect(findDropdownOptions(findRedirectSection(panelContainer)))
        .toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <div
              class="aa-ItemWrapper"
            >
              <div
                class="aa-ItemContent"
              >
                <div
                  class="aa-ItemIcon aa-ItemIcon--noBorder"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
                    />
                  </svg>
                </div>
                <div
                  class="aa-ItemContentBody"
                >
                  <div
                    class="aa-ItemContentTitle"
                  >
                    <a
                      class="aa-ItemLink"
                      href="https://www.algolia.com"
                    >
                      redirect item
                    </a>
                  </div>
                </div>
              </div>
              <div
                class="aa-ItemActions"
              >
                <div
                  class="aa-ItemActionButton"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line
                      x1="5"
                      x2="19"
                      y1="12"
                      y2="12"
                    />
                    <polyline
                      points="12 5 19 12 12 19"
                    />
                  </svg>
                </div>
              </div>
            </div>,
          ],
        ]
      `);
    });
  });

  test('renders a redirect item with a custom template when using the template param and the redirect payload is returned', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({
      templates: {
        item({ html, state }) {
          return html`<a>My custom option: ${state.query}</a>`;
        },
      },
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [createMockSource()];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });

    await waitFor(() => {
      expect(findHitsSection(panelContainer)).not.toBeInTheDocument();

      expect(findDropdownOptions(findRedirectSection(panelContainer)))
        .toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <a>
              My custom option: 
              redirect item
            </a>,
          ],
        ]
      `);
    });
  });

  test('renders a redirect item when a custom expected payload is returned', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({
      transformResponse(response) {
        return (response as Record<string, any>).customRedirect?.url;
      },
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [
          createMockSource({
            results: [
              {
                query: 'custom redirect item',
                customRedirect: { url: RESPONSE.renderingContent.redirect.url },
              },
            ],
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });

    await waitFor(() => {
      expect(findHitsSection(panelContainer)).not.toBeInTheDocument();
      expect(findRedirectSection(panelContainer)).toBeInTheDocument();
    });
  });

  test('renders the items from the provided source when a redirect is not in the payload', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();
    const query = 'not a redirect item';

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [createMockSource({ results: [{ hits: [{ query }] }] })];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: query } });

    await waitFor(() => {
      expect(findDropdownOptions(findHitsSection(panelContainer)))
        .toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <a>
              not a redirect item
            </a>,
          ],
        ]
      `);

      expect(findRedirectSection(panelContainer)).not.toBeInTheDocument();
    });
  });

  test('renders a redirect item and hits when the default redirect payload is returned with other hits', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [
          createMockSource({
            results: [
              {
                ...RESPONSE,
                hits: [
                  { query: 'redirect item' },
                  { query: 'not a redirect item 1' },
                  { query: 'not a redirect item 2' },
                ],
              },
            ],
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });

    await waitFor(() => {
      expect(findRedirectSection(panelContainer)).toBeInTheDocument();

      expect(findDropdownOptions(findHitsSection(panelContainer)))
        .toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <a>
              redirect item
            </a>,
          ],
          HTMLCollection [
            <a>
              not a redirect item 1
            </a>,
          ],
          HTMLCollection [
            <a>
              not a redirect item 2
            </a>,
          ],
        ]
      `);
    });
  });

  test('filters out items that match the query', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [
          createMockSource({
            results: [
              {
                ...RESPONSE,
                hits: [
                  { query: 'redirect item' },
                  { query: 'not a redirect item 1' },
                  { query: 'not a redirect item 2' },
                ],
              },
            ],
            getItemInputValue({ item }) {
              return item.query;
            },
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });

    await waitFor(() => {
      expect(findRedirectSection(panelContainer)).toBeInTheDocument();

      expect(findDropdownOptions(findHitsSection(panelContainer)))
        .toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <a>
              not a redirect item 1
            </a>,
          ],
          HTMLCollection [
            <a>
              not a redirect item 2
            </a>,
          ],
        ]
      `);
    });
  });

  test('triggers navigator with the provided url when clicking on a rendered redirect item', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();
    const navigator = createNavigator();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      navigator,
      getSources() {
        return [createMockSource()];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });

    let redirectItem;
    await waitFor(() => {
      redirectItem = findDropdownOptions(
        findRedirectSection(panelContainer)
      )[0][0];
      expect(redirectItem).toHaveTextContent(REDIRECT_QUERY);
    });

    fireEvent.click(redirectItem);
    await waitFor(() => {
      expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });
  });

  test('triggers navigator with the provided url when pressing enter in the input and a redirect item is present', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();
    const navigator = createNavigator();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      navigator,
      getSources() {
        return [createMockSource()];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });
    await waitFor(() => {
      expect(
        findDropdownOptions(findRedirectSection(panelContainer))[0][0]
      ).toHaveTextContent(REDIRECT_QUERY);
    });

    fireEvent.submit(input);

    await waitFor(() => {
      expect(input.value).toBe(REDIRECT_QUERY);
      expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });
  });

  test('selecting a hit that creates a redirect url will reopen the dropdown menu and then submitting the form will trigger the navigator', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();
    const navigator = createNavigator();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      navigator,
      getSources({ query }) {
        return [
          createMockSource({
            results:
              query === REDIRECT_QUERY
                ? [
                    {
                      hits: [{ query: REDIRECT_QUERY }],
                      renderingContent: {
                        redirect: {
                          url: 'https://www.algolia.com',
                        },
                      },
                    },
                  ]
                : [
                    {
                      hits: [
                        { query: 'something else' },
                        { query: REDIRECT_QUERY },
                      ],
                    },
                  ],
            getItemInputValue({ item }) {
              return item.query;
            },
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: 'hey' } });

    await waitFor(() => {
      expect(findRedirectSection(panelContainer)).not.toBeInTheDocument();
      expect(findDropdownOptions(findHitsSection(panelContainer)))
        .toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <a>
              something else
            </a>,
          ],
          HTMLCollection [
            <a>
              redirect item
            </a>,
          ],
        ]
      `);
    });

    fireEvent.click(findDropdownOptions(panelContainer)[1][0]);

    await waitFor(() => {
      expect(input.value).toBe(REDIRECT_QUERY);
      expect(findHitsSection(panelContainer)).not.toBeInTheDocument();
      expect(findDropdownOptions(findRedirectSection(panelContainer)))
        .toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <div
              class="aa-ItemWrapper"
            >
              <div
                class="aa-ItemContent"
              >
                <div
                  class="aa-ItemIcon aa-ItemIcon--noBorder"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
                    />
                  </svg>
                </div>
                <div
                  class="aa-ItemContentBody"
                >
                  <div
                    class="aa-ItemContentTitle"
                  >
                    <a
                      class="aa-ItemLink"
                      href="https://www.algolia.com"
                    >
                      redirect item
                    </a>
                  </div>
                </div>
              </div>
              <div
                class="aa-ItemActions"
              >
                <div
                  class="aa-ItemActionButton"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line
                      x1="5"
                      x2="19"
                      y1="12"
                      y2="12"
                    />
                    <polyline
                      points="12 5 19 12 12 19"
                    />
                  </svg>
                </div>
              </div>
            </div>,
          ],
        ]
      `);
    });

    fireEvent.submit(input);

    await waitFor(() => {
      expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });
  });

  test('triggers a custom navigator when triggering a redirect and providing a custom onRedirect hook', async () => {
    const onRedirect = jest.fn();
    const redirectUrlPlugin = createRedirectUrlPlugin({
      onRedirect,
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
    });

    fireEvent.submit(findInput(container));
    await waitFor(() => {
      expect(onRedirect).toHaveBeenCalledTimes(1);
    });
  });

  test('stores a list of multiple redirects per source and renders the first by default when a source has multiple queries', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();
    const navigator = createNavigator();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      navigator,
      getSources() {
        return [
          createMockSource({
            results: [
              {
                query: REDIRECT_QUERY,
                renderingContent: {
                  redirect: {
                    url: 'https://www.algolia.com/1',
                  },
                },
                hits: [{ query: REDIRECT_QUERY }, { query: 'redirect item 1' }],
              },
              {
                query: REDIRECT_QUERY,
                renderingContent: {
                  redirect: {
                    url: 'https://www.algolia.com/2',
                  },
                },
                hits: [{ query: REDIRECT_QUERY }, { query: 'redirect item 2' }],
              },
            ],
            queries: [
              { query: REDIRECT_QUERY, indexName: 'mock-index-1' },
              { query: REDIRECT_QUERY, indexName: 'mock-index-2' },
            ],
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });
    await waitFor(() => {
      expect(
        findDropdownOptions(findRedirectSection(panelContainer))[0][0]
      ).toHaveTextContent(REDIRECT_QUERY);
    });

    fireEvent.submit(input);
    await waitFor(() => {
      expect(input.value).toBe(REDIRECT_QUERY);
      expect(navigator.navigate).toHaveBeenCalledWith(
        expect.objectContaining({
          item: {
            sourceId: 'mock-source',
            urls: ['https://www.algolia.com/1', 'https://www.algolia.com/2'],
          },
          itemUrl: 'https://www.algolia.com/1',
        })
      );
    });
  });

  test('stores a list of multiple sources with redirects and renders the first by default when there are multiple sources', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin();
    const navigator = createNavigator();

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      navigator,
      getSources() {
        return [
          createMockSource({
            sourceId: 'mock-source-1',
            results: [
              {
                query: REDIRECT_QUERY,
                renderingContent: {
                  redirect: {
                    url: 'https://www.algolia.com/1',
                  },
                },
                hits: [{ query: REDIRECT_QUERY }, { query: 'redirect item 1' }],
              },
            ],
            queries: [{ query: REDIRECT_QUERY, indexName: 'mock-index-1' }],
          }),
          createMockSource({
            sourceId: 'mock-source-2',
            results: [
              {
                query: REDIRECT_QUERY,
                renderingContent: {
                  redirect: {
                    url: 'https://www.algolia.com/2',
                  },
                },
                hits: [{ query: REDIRECT_QUERY }, { query: 'redirect item 2' }],
              },
            ],
            queries: [{ query: REDIRECT_QUERY, indexName: 'mock-index-2' }],
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });
    await waitFor(() => {
      expect(
        findDropdownOptions(findRedirectSection(panelContainer))[0][0]
      ).toHaveTextContent(REDIRECT_QUERY);
    });

    fireEvent.submit(input);
    await waitFor(() => {
      expect(input.value).toBe(REDIRECT_QUERY);
      expect(navigator.navigate).toHaveBeenCalledWith(
        expect.objectContaining({
          item: {
            sourceId: 'mock-source-1',
            urls: ['https://www.algolia.com/1'],
          },
          itemUrl: 'https://www.algolia.com/1',
          state: expect.objectContaining({
            context: {
              redirectUrlPlugin: {
                data: [
                  {
                    sourceId: 'mock-source-1',
                    urls: ['https://www.algolia.com/1'],
                  },
                  {
                    sourceId: 'mock-source-2',
                    urls: ['https://www.algolia.com/2'],
                  },
                ],
              },
            },
          }),
        })
      );
    });
  });
});
