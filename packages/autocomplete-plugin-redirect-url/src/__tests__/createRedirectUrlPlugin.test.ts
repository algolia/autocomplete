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
        return html`<a>${item.name}</a>`;
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

  test('exposes all provided options with plugin.__autocomplete_pluginOptions', () => {
    const plugin = createRedirectUrlPlugin({
      transformResponse: jest.fn(),
      templates: { item: () => 'hey' },
      onRedirect: jest.fn(),
      awaitSubmit: () => false,
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      transformResponse: expect.any(Function),
      templates: expect.any(Object),
      onRedirect: expect.any(Function),
      awaitSubmit: expect.any(Function),
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

      const dropdownOptions = findDropdownOptions(
        findRedirectSection(panelContainer)
      );

      expect(dropdownOptions).toHaveLength(1);
      expect(dropdownOptions[0].item(0)).toHaveTextContent(REDIRECT_QUERY);
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

      const dropdownOptions = findDropdownOptions(
        findRedirectSection(panelContainer)
      );

      expect(dropdownOptions).toHaveLength(1);
      expect(dropdownOptions[0].item(0)).toHaveTextContent(
        'My custom option: redirect item'
      );
    });
  });

  test('does not render a redirect item when the query from the state does not match the response', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({
      transformResponse(response) {
        return (response as Record<string, any>).renderingContent?.redirect
          ?.url;
      },
      transformResponseToQuery() {
        return 'different query';
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
      expect(findRedirectSection(panelContainer)).not.toBeInTheDocument();
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
        return [createMockSource({ results: [{ hits: [{ name: query }] }] })];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: query } });

    await waitFor(() => {
      const dropdownOptions = findDropdownOptions(
        findHitsSection(panelContainer)
      );

      expect(dropdownOptions).toHaveLength(1);
      expect(dropdownOptions[0].item(0)).toHaveTextContent(
        'not a redirect item'
      );

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
                  { name: 'redirect item' },
                  { name: 'not a redirect item 1' },
                  { name: 'not a redirect item 2' },
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

      const dropdownOptions = findDropdownOptions(
        findHitsSection(panelContainer)
      );

      expect(dropdownOptions).toHaveLength(3);
      expect(dropdownOptions[0].item(0)).toHaveTextContent(REDIRECT_QUERY);
      expect(dropdownOptions[1].item(0)).toHaveTextContent(
        'not a redirect item 1'
      );
      expect(dropdownOptions[2].item(0)).toHaveTextContent(
        'not a redirect item 2'
      );
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
                  { name: REDIRECT_QUERY },
                  { name: 'not a redirect item 1' },
                  { name: 'not a redirect item 2' },
                ],
              },
            ],
            getItemInputValue({ item }) {
              return item.name;
            },
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: REDIRECT_QUERY } });

    await waitFor(() => {
      expect(findRedirectSection(panelContainer)).toBeInTheDocument();

      const dropdownOptions = findDropdownOptions(
        findHitsSection(panelContainer)
      );
      expect(dropdownOptions).toHaveLength(2);
      expect(dropdownOptions[0].item(0)).toHaveTextContent(
        'not a redirect item 1'
      );
      expect(dropdownOptions[1].item(0)).toHaveTextContent(
        'not a redirect item 2'
      );
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
      const dropdownOptions = findDropdownOptions(
        findRedirectSection(panelContainer)
      );

      expect(dropdownOptions).toHaveLength(1);
      expect(dropdownOptions[0].item(0)).toHaveTextContent(REDIRECT_QUERY);
    });

    fireEvent.submit(input);

    await waitFor(() => {
      expect(input).toHaveValue(REDIRECT_QUERY);
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
                      hits: [{ name: REDIRECT_QUERY }],
                      query: REDIRECT_QUERY,
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
                        { name: 'something else' },
                        { name: REDIRECT_QUERY },
                      ],
                      query: 'something else',
                    },
                  ],
            getItemInputValue({ item }) {
              return item.name;
            },
          }),
        ];
      },
    });

    const input = findInput(container);

    fireEvent.input(input, { target: { value: 'hey' } });

    await waitFor(() => {
      expect(findRedirectSection(panelContainer)).not.toBeInTheDocument();
      const dropdownOptions = findDropdownOptions(
        findHitsSection(panelContainer)
      );
      expect(dropdownOptions).toHaveLength(2);
      expect(dropdownOptions[0].item(0)).toHaveTextContent('something else');
      expect(dropdownOptions[1].item(0)).toHaveTextContent(REDIRECT_QUERY);
    });

    fireEvent.click(findDropdownOptions(panelContainer)[1][0]);

    await waitFor(() => {
      expect(input).toHaveValue(REDIRECT_QUERY);
      expect(findHitsSection(panelContainer)).not.toBeInTheDocument();
      const dropdownOptions = findDropdownOptions(
        findRedirectSection(panelContainer)
      );

      expect(dropdownOptions).toHaveLength(1);
      expect(dropdownOptions[0].item(0)).toHaveTextContent(REDIRECT_QUERY);
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
      expect(input).toHaveValue(REDIRECT_QUERY);
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
      expect(input).toHaveValue(REDIRECT_QUERY);
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
