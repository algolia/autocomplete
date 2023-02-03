import { autocomplete } from '@algolia/autocomplete-js';
import { fireEvent, waitFor, within } from '@testing-library/dom';

import { createNavigator } from '../../../../test/utils';
import { createRedirectUrlPlugin } from '../createRedirectUrlPlugin';

const SOURCE_ID = 'mock-source';
const RESPONSE = {
  query: 'redirect item',
  renderingContent: {
    redirect: {
      url: 'https://www.algolia.com',
    },
  },
};

function createMockSource(
  sourceId = SOURCE_ID,
  response: Record<string, any> = RESPONSE
) {
  return {
    sourceId,
    getItems() {
      return response;
    },
    templates: {
      item({ item, html }) {
        return html`<a>${item.query}</a>`;
      },
    },
  };
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createRedirectUrlPlugin', () => {
  test('has a name', () => {
    const plugin = createRedirectUrlPlugin({});

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
    const redirectUrlPlugin = createRedirectUrlPlugin({});

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

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: RESPONSE.query } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          `[data-autocomplete-source-id="${SOURCE_ID}"]`
        )
      ).not.toBeInTheDocument();

      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="redirectUrlPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
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
                    redirect item
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

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: RESPONSE.query } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          `[data-autocomplete-source-id="${SOURCE_ID}"]`
        )
      ).not.toBeInTheDocument();

      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="redirectUrlPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
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
          createMockSource(SOURCE_ID, {
            query: 'custom redirect item',
            customRedirect: { url: RESPONSE.renderingContent.redirect.url },
          }),
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: RESPONSE.query } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          `[data-autocomplete-source-id="${SOURCE_ID}"]`
        )
      ).not.toBeInTheDocument();

      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="redirectUrlPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
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
                    redirect item
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

  test('renders the items from the provided source when a redirect is not in the payload', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({});
    const query = 'not a redirect item';

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [createMockSource(SOURCE_ID, { query })];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: query } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            `[data-autocomplete-source-id="${SOURCE_ID}"]`
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <a>
              not a redirect item
            </a>,
          ],
        ]
      `);

      expect(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="redirectUrlPlugin"]'
        )
      ).not.toBeInTheDocument();
    });
  });

  test('triggers navigator with the provided url when clicking on a rendered redirect item', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({});
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

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: RESPONSE.query } });

    let redirectItem;
    await waitFor(() => {
      redirectItem = within(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="redirectUrlPlugin"]'
        )
      )
        .getAllByRole('option')
        .map((option) => option.children)[0][0];
      expect(redirectItem).toHaveTextContent(RESPONSE.query);
    });

    fireEvent.click(redirectItem);
    await waitFor(() => {
      expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });
  });

  test('triggers navigator with the provided url when pressing enter in the input and a redirect item is present', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({});
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

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: RESPONSE.query } });
    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="redirectUrlPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)[0][0]
      ).toHaveTextContent(RESPONSE.query);
    });

    fireEvent.submit(input);

    await waitFor(() => {
      expect(input.value).toBe(RESPONSE.query);
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

    fireEvent.submit(container.querySelector<HTMLInputElement>('.aa-Input'));
    await waitFor(() => {
      expect(onRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
