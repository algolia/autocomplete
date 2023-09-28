/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { Hit } from '@algolia/client-search';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { h } from 'preact';

import { HTMLTemplate } from '../types';

import products from './fixtures/products.json';

type ProductRecord = {
  brand: string;
  categories: string[];
  description: string;
  free_shipping: boolean;
  hierarchicalCategories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
    lvl6?: string;
  };
  image: string;
  name: string;
  popularity: number;
  price: number;
  prince_range: string;
  rating: number;
  type: string;
};
type ProductHit = Hit<ProductRecord>;

const productHits = products.results[0].hits;

describe('templates', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renders JSX templates', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete<{ label: string }>({
      container,
      panelContainer,
      id: 'autocomplete-0',
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems({ query }) {
              return [{ label: '1' }].filter(({ label }) =>
                label.includes(query)
              );
            },
            templates: {
              header() {
                return <header className="MyCustomHeaderClass">Header</header>;
              },
              item({ item }) {
                return <div className="MyCustomItemClass">{item.label}</div>;
              },
              footer() {
                return <footer className="MyCustomFooterClass">Footer</footer>;
              },
              noResults() {
                return <div className="MyCustomNoResultsClass">No results</div>;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: '1' } });

    await waitFor(() => {
      expect(within(panelContainer).getByRole('banner')).toMatchInlineSnapshot(`
        <header
          class="MyCustomHeaderClass"
        >
          Header
        </header>
      `);
      expect(within(panelContainer).getByRole('listbox'))
        .toMatchInlineSnapshot(`
        <ul
          aria-labelledby="autocomplete-0-label"
          class="aa-List"
          id="autocomplete-0-testSource-list"
          role="listbox"
        >
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-0-testSource-item-0"
            role="option"
          >
            <div
              class="MyCustomItemClass"
            >
              1
            </div>
          </li>
        </ul>
      `);
      expect(within(panelContainer).getByRole('contentinfo'))
        .toMatchInlineSnapshot(`
        <footer
          class="MyCustomFooterClass"
        >
          Footer
        </footer>
      `);
    });

    fireEvent.input(input, { target: { value: 'nothing' } });

    await waitFor(() => {
      expect(within(panelContainer).getByText('No results').parentNode)
        .toMatchInlineSnapshot(`
        <div
          class="aa-SourceNoResults"
        >
          <div
            class="MyCustomNoResultsClass"
          >
            No results
          </div>
        </div>
      `);
    });
  });

  test('renders templates using `createElement`', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete<{ label: string }>({
      container,
      panelContainer,
      id: 'autocomplete-0',
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems({ query }) {
              return [{ label: '1' }].filter(({ label }) =>
                label.includes(query)
              );
            },
            templates: {
              header({ createElement }) {
                return createElement(
                  'header',
                  { className: 'MyCustomHeaderClass' },
                  'Header'
                );
              },
              item({ item, createElement }) {
                return createElement(
                  'div',
                  { className: 'MyCustomItemClass' },
                  item.label
                );
              },
              footer({ createElement }) {
                return createElement(
                  'footer',
                  { className: 'MyCustomFooterClass' },
                  'Footer'
                );
              },
              noResults({ createElement }) {
                return createElement(
                  'div',
                  { className: 'MyCustomNoResultsClass' },
                  'No results'
                );
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: '1' } });

    await waitFor(() => {
      expect(within(panelContainer).getByRole('banner')).toMatchInlineSnapshot(`
        <header
          class="MyCustomHeaderClass"
        >
          Header
        </header>
      `);
      expect(within(panelContainer).getByRole('listbox'))
        .toMatchInlineSnapshot(`
        <ul
          aria-labelledby="autocomplete-0-label"
          class="aa-List"
          id="autocomplete-0-testSource-list"
          role="listbox"
        >
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-0-testSource-item-0"
            role="option"
          >
            <div
              class="MyCustomItemClass"
            >
              1
            </div>
          </li>
        </ul>
      `);
      expect(within(panelContainer).getByRole('contentinfo'))
        .toMatchInlineSnapshot(`
        <footer
          class="MyCustomFooterClass"
        >
          Footer
        </footer>
      `);
    });

    fireEvent.input(input, { target: { value: 'nothing' } });

    await waitFor(() => {
      expect(within(panelContainer).getByText('No results').parentNode)
        .toMatchInlineSnapshot(`
        <div
          class="aa-SourceNoResults"
        >
          <div
            class="MyCustomNoResultsClass"
          >
            No results
          </div>
        </div>
      `);
    });
  });

  test('renders templates using `html`', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete<ProductHit>({
      container,
      panelContainer,
      id: 'autocomplete-0',
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems({ query }) {
              return [productHits[0]].filter(({ name }) =>
                name.toLowerCase().includes(query)
              );
            },
            templates: {
              header({ html }) {
                return html`<header class="MyCustomHeaderClass">
                  Header
                </header>`;
              },
              item({ item, components, html }) {
                return html`<div class="MyCustomItemClass">
                  <h2>
                    ${components.Highlight({
                      hit: item,
                      attribute: 'name',
                    })}
                  </h2>
                  <p>$${item.price}</p>
                </div>`;
              },
              footer({ html }) {
                return html`<footer class="MyCustomFooterClass">
                  Footer
                </footer>`;
              },
              noResults({ html }) {
                return html`<div class="MyCustomNoResultsClass">
                  No results
                </div>`;
              },
            },
          },
        ];
      },
      render({ children, render, html }, root) {
        render(
          html`<div data-testid="results" class="aa-SomeResults">
            ${children}
          </div>`,
          root
        );
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'apple' } });

    await waitFor(() => {
      expect(within(panelContainer).getByTestId('results'))
        .toMatchInlineSnapshot(`
        <div
          class="aa-SomeResults"
          data-testid="results"
        >
          <div
            class="aa-PanelLayout aa-Panel--scrollable"
          >
            <section
              class="aa-Source"
              data-autocomplete-source-id="testSource"
            >
              <div
                class="aa-SourceHeader"
              >
                <header
                  class="MyCustomHeaderClass"
                >
                  Header
                </header>
              </div>
              <ul
                aria-labelledby="autocomplete-0-label"
                class="aa-List"
                id="autocomplete-0-testSource-list"
                role="listbox"
              >
                <li
                  aria-selected="false"
                  class="aa-Item"
                  id="autocomplete-0-testSource-item-0"
                  role="option"
                >
                  <div
                    class="MyCustomItemClass"
                  >
                    <h2>
                      Apple - 
                      <mark>
                        iPhone
                      </mark>
                       SE 16GB - Space Gray (Verizon)
                    </h2>
                    <p>
                      $
                      449.99
                    </p>
                  </div>
                </li>
              </ul>
              <div
                class="aa-SourceFooter"
              >
                <footer
                  class="MyCustomFooterClass"
                >
                  Footer
                </footer>
              </div>
            </section>
          </div>
          <div
            class="aa-GradientBottom"
          />
        </div>
      `);
    });

    fireEvent.input(input, { target: { value: 'nothing' } });

    await waitFor(() => {
      expect(within(panelContainer).getByText('No results').parentNode)
        .toMatchInlineSnapshot(`
        <div
          class="aa-SourceNoResults"
        >
          <div
            class="MyCustomNoResultsClass"
          >
            No results
          </div>
        </div>
      `);
    });
  });

  test('renders templates using documented `html` shim (for IE 11)', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete<ProductHit>({
      container,
      panelContainer,
      id: 'autocomplete-0',
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems({ query }) {
              return [productHits[0]].filter(({ name }) =>
                name.toLowerCase().includes(query)
              );
            },
            templates: {
              header({ html }) {
                return htmlShim(
                  '<header class="MyCustomHeaderClass">Header</header>',
                  html
                );
              },
              item({ item, components, html }) {
                return htmlShim(
                  [
                    '<div class="MyCustomItemClass"><h2>',
                    components.Highlight({
                      hit: item,
                      attribute: 'name',
                    }),
                    '</h2><p>',
                    item.price,
                    '</p><div>',
                  ],
                  html
                );
              },
              footer({ html }) {
                return htmlShim(
                  '<footer class="MyCustomFooterClass">Footer</footer>',
                  html
                );
              },
              noResults({ html }) {
                return htmlShim(
                  '<div class="MyCustomNoResultsClass">No results</div>',
                  html
                );
              },
            },
          },
        ];
      },
      render({ children, render, html }, root) {
        render(
          htmlShim(
            [
              '<div data-testid="results" class="aa-SomeResults">',
              children,
              '</div>',
            ],
            html
          ),
          root
        );
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'apple' } });

    await waitFor(() => {
      expect(within(panelContainer).getByTestId('results'))
        .toMatchInlineSnapshot(`
        <div
          class="aa-SomeResults"
          data-testid="results"
        >
          <div
            class="aa-PanelLayout aa-Panel--scrollable"
          >
            <section
              class="aa-Source"
              data-autocomplete-source-id="testSource"
            >
              <div
                class="aa-SourceHeader"
              >
                <header
                  class="MyCustomHeaderClass"
                >
                  Header
                </header>
              </div>
              <ul
                aria-labelledby="autocomplete-0-label"
                class="aa-List"
                id="autocomplete-0-testSource-list"
                role="listbox"
              >
                <li
                  aria-selected="false"
                  class="aa-Item"
                  id="autocomplete-0-testSource-item-0"
                  role="option"
                >
                  div
                </li>
              </ul>
              <div
                class="aa-SourceFooter"
              >
                <footer
                  class="MyCustomFooterClass"
                >
                  Footer
                </footer>
              </div>
            </section>
          </div>
          <div
            class="aa-GradientBottom"
          />
        </div>
      `);
    });

    fireEvent.input(input, { target: { value: 'nothing' } });

    await waitFor(() => {
      expect(within(panelContainer).getByText('No results').parentNode)
        .toMatchInlineSnapshot(`
        <div
          class="aa-SourceNoResults"
        >
          <div
            class="MyCustomNoResultsClass"
          >
            No results
          </div>
        </div>
      `);
    });
  });
});

function htmlShim(template: Array<string | any> | string, html: HTMLTemplate) {
  if (typeof template === 'string') {
    return html([template] as unknown as TemplateStringsArray);
  }

  const [strings, variables] = template.reduce(
    (acc, part, index) => {
      const isEven = index % 2 === 0;

      acc[Math.abs(Number(!isEven))].push(part);

      return acc;
    },
    [[], []]
  );

  // Before TypeScript 2, `TemplateStringsArray` was assignable to `string[]`.
  // This is no longer the case, but `htm` does accept `string[]`.
  // Since this solution is for IE11 users who don't have a build step, it isn't
  // necessary to complexify the function to make it type-safe.
  return html(strings as unknown as TemplateStringsArray, ...variables);
}
