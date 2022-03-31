/** @jsx h */
import { autocomplete } from '@algolia/autocomplete-js';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { h } from 'preact';

import { HTMLTemplate } from '../types';

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
          id="autocomplete-0-list"
          role="listbox"
        >
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-0-item-0"
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
          id="autocomplete-0-list"
          role="listbox"
        >
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-0-item-0"
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
              header({ html }) {
                return html`<header class="MyCustomHeaderClass">
                  Header
                </header>`;
              },
              item({ item, html }) {
                return html`<div class="MyCustomItemClass">${item.label}</div>`;
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
          id="autocomplete-0-list"
          role="listbox"
        >
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-0-item-0"
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

  test('renders templates using documented `html` shim (for IE 11)', async () => {
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
              header({ html }) {
                return htmlShim(
                  '<header class="MyCustomHeaderClass">Header</header>',
                  html
                );
              },
              item({ item, html }) {
                return htmlShim(
                  ['<div class="MyCustomItemClass">', item.label, '</div>'],
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
          id="autocomplete-0-list"
          role="listbox"
        >
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-0-item-0"
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
});

function htmlShim(template: Array<string | any> | string, html: HTMLTemplate) {
  if (typeof template === 'string') {
    return html(([template] as unknown) as TemplateStringsArray);
  }

  const [strings, variables] = template.reduce<[string[], any[]]>(
    (acc, part, index) => {
      const isOdd = index % 2 === 0;

      acc[Math.abs(Number(!isOdd))].push(part as any);

      return acc;
    },
    [[], []]
  );

  // Before TypeScript 2, `TemplateStringsArray` was assignable to `string[]`.
  // This is no longer the case, but `htm` does accept `string[]`.
  // Since this solution is for IE11 users who don't have a build step, it isn't
  // necessary to complexify the function to make it type-safe.
  return html((strings as unknown) as TemplateStringsArray, ...variables);
}
