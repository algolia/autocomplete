import { autocomplete } from '@algolia/autocomplete-js';
import { fireEvent, waitFor, within } from '@testing-library/dom';

import { createNavigator } from '../../../../test/utils';
import { createRedirectUrlPlugin } from '../createRedirectUrlPlugin';

const SOURCE_ID = 'mock-source';
const REDIRECT_ITEM_VALUE = 'redirect item';

function createRedirectSource() {
  return {
    sourceId: SOURCE_ID,
    getItems() {
      return {
        value: REDIRECT_ITEM_VALUE,
        renderingContent: {
          redirect: {
            url: 'https://www.algolia.com',
          },
        },
      };
    },
    templates: {
      item({ item, html }) {
        return html`<a class="aa-ItemLink">${item.value}</a>`;
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

  test('renders the template with a redirect url item in place of a matched item from the provided source when the redirect url is returned in the source and the input query matches exactly the redirect item', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({});

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [createRedirectSource()];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: REDIRECT_ITEM_VALUE } });

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

  test('renders the items from the provided source when a redirect url is not returned in the source', async () => {
    const redirectUrlPlugin = createRedirectUrlPlugin({});

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [redirectUrlPlugin],
      getSources() {
        return [
          {
            sourceId: SOURCE_ID,
            getItems() {
              return {
                value: 'not a redirect item',
              };
            },
            templates: {
              item({ item, html }) {
                return html`<a class="aa-ItemLink">${item.value}</a>`;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'not a redirect item' } });

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
            <a
              class="aa-ItemLink"
            >
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
        return [createRedirectSource()];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: REDIRECT_ITEM_VALUE } });

    let redirectItem;
    await waitFor(() => {
      redirectItem = within(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="redirectUrlPlugin"]'
        )
      )
        .getAllByRole('option')
        .map((option) => option.children)[0][0];
      expect(redirectItem).toHaveTextContent(REDIRECT_ITEM_VALUE);
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
        return [createRedirectSource()];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: REDIRECT_ITEM_VALUE } });
    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="redirectUrlPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)[0][0]
      ).toHaveTextContent(REDIRECT_ITEM_VALUE);
    });

    fireEvent.submit(input);

    await waitFor(() => {
      expect(input.value).toBe(REDIRECT_ITEM_VALUE);
      expect(navigator.navigate).toHaveBeenCalledTimes(1);
    });
  });
});
