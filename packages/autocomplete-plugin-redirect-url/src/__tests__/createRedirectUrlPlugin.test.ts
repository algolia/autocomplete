import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions/src';
import { fireEvent, waitFor, within } from '@testing-library/dom';

import { createRedirectUrlPlugin } from '../createRedirectUrlPlugin';

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

  test.only('adds a source with a redirect url item in place of the match in the provided source and renders the template', async () => {
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
            sourceId: 'redirect-mock-source',
            getItems() {
              return {
                value: 'redirect item',
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
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'redirect item' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="redirect-mock-source"]'
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
});
