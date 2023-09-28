import { warnCache } from '@algolia/autocomplete-shared';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createElement as preactCreateElement,
  Fragment as PreactFragment,
  render as preactRender,
} from 'preact';

import { autocomplete } from '../autocomplete';

describe('renderer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    warnCache.current = {};
  });

  test('defaults to the Preact implementation', () => {
    expect.assertions(3);

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    const { destroy } = autocomplete<{ label: string }>({
      container,
      panelContainer,
      initialState: {
        isOpen: true,
      },
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [{ label: '1' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ createElement, Fragment, render }, root) {
        expect(createElement).toBe(preactCreateElement);
        expect(Fragment).toBe(PreactFragment);
        expect(render).toBe(preactRender);

        render(createElement(Fragment, null, 'testSource'), root);
      },
    });

    destroy();
  });

  test('accepts a custom renderer', () => {
    expect.assertions(6);

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const mockRender = jest.fn().mockImplementation(preactRender);

    document.body.appendChild(panelContainer);

    const { destroy } = autocomplete<{ label: string }>({
      container,
      panelContainer,
      initialState: {
        isOpen: true,
      },
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [{ label: '1' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ children, createElement, Fragment, render, html }, root) {
        expect(createElement).toBe(mockCreateElement);
        expect(Fragment).toBe(CustomFragment);
        expect(render).toBe(mockRender);
        expect(mockCreateElement).toHaveBeenCalled();

        mockCreateElement.mockClear();

        render(html`<div>${children}</div>`, root);

        expect(mockCreateElement).toHaveBeenCalledTimes(1);
        expect(mockCreateElement).toHaveBeenLastCalledWith(
          'div',
          null,
          expect.any(Object)
        );
      },
      renderer: {
        createElement: mockCreateElement,
        Fragment: CustomFragment,
        render: mockRender,
      },
    });

    destroy();
  });

  test('defaults `render` when not specified in the renderer', () => {
    expect.assertions(1);

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);

    document.body.appendChild(panelContainer);

    const { destroy } = autocomplete<{ label: string }>({
      container,
      panelContainer,
      initialState: {
        isOpen: true,
      },
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [{ label: '1' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ createElement, Fragment, render }, root) {
        expect(render).toBe(preactRender);

        preactRender(createElement(Fragment, null, 'testSource'), root);
      },
      renderer: {
        createElement: mockCreateElement,
        Fragment: CustomFragment,
      },
    });

    destroy();
  });

  test('uses a custom `render` via `renderer`', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn(preactCreateElement);
    const mockRender = jest.fn().mockImplementation(preactRender);

    const { destroy } = autocomplete<{ label: string }>({
      container,
      panelContainer,
      id: 'autocomplete-0',
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [{ label: '1' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      renderer: {
        Fragment: CustomFragment,
        render: mockRender,
        createElement: mockCreateElement,
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'apple' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
      expect(mockRender).toHaveBeenCalled();
      expect(panelContainer).toMatchInlineSnapshot(`
        <div>
          <div
            class="aa-Panel"
            data-testid="panel"
            style="top: 0px; left: 0px; right: 0px; max-width: unset;"
          >
            <div
              class="aa-PanelLayout aa-Panel--scrollable"
            >
              <section
                class="aa-Source"
                data-autocomplete-source-id="testSource"
              >
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
                    1
                  </li>
                </ul>
              </section>
            </div>
            <div
              class="aa-GradientBottom"
            />
          </div>
        </div>
      `);
    });

    destroy();
  });

  test('warns about renderer mismatch when specifying an incomplete renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const CustomFragment = (props: any) => props.children;
    const mockRender = jest.fn().mockImplementation(preactRender);

    document.body.appendChild(panelContainer);

    let instance;

    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        renderer: {
          createElement: mockCreateElement,
          Fragment: CustomFragment,
        },
      });
    }).toWarnDev(
      '[Autocomplete] You provided an incomplete `renderer` (missing: `renderer.render`). This can cause rendering issues.' +
        '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-renderer'
    );
    instance.destroy();

    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        // Accidentally not passing required `renderer` properties is possible
        // for Non-TypeScript users
        // @ts-expect-error
        renderer: {
          Fragment: CustomFragment,
          render: mockRender,
        },
      });
    }).toWarnDev(
      '[Autocomplete] You provided an incomplete `renderer` (missing: `renderer.createElement`). This can cause rendering issues.' +
        '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-renderer'
    );
    instance.destroy();

    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        // Accidentally not passing required `renderer` properties is possible
        // for Non-TypeScript users
        // @ts-expect-error
        renderer: {
          createElement: mockCreateElement,
          render: mockRender,
        },
      });
    }).toWarnDev(
      '[Autocomplete] You provided an incomplete `renderer` (missing: `renderer.Fragment`). This can cause rendering issues.' +
        '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-renderer'
    );
    instance.destroy();

    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        // Accidentally not passing required `renderer` properties is possible
        // for Non-TypeScript users
        // @ts-expect-error
        renderer: {
          createElement: mockCreateElement,
        },
      });
    }).toWarnDev(
      '[Autocomplete] You provided an incomplete `renderer` (missing: `renderer.Fragment`, `renderer.render`). This can cause rendering issues.' +
        '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-renderer'
    );
    instance.destroy();
  });

  test('warns about new `renderer.render` option when specifying an incomplete renderer and a `render` option', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const CustomFragment = (props: any) => props.children;

    document.body.appendChild(panelContainer);

    let instance;
    function startAutocomplete() {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        renderer: {
          createElement: mockCreateElement,
          Fragment: CustomFragment,
        },
        render({ children }, root) {
          preactRender(children, root);
        },
      });
    }

    expect(startAutocomplete).toWarnDev(
      '[Autocomplete] You provided the `render` option but did not provide a `renderer.render`. Since v1.6.0, you can provide a `render` function directly in `renderer`.' +
        '\nTo get rid of this warning, do any of the following depending on your use case.' +
        "\n- If you are using the `render` option only to override Autocomplete's default `render` function, pass the `render` function into `renderer` and remove the `render` option." +
        '\n- If you are using the `render` option to customize the layout, pass your `render` function into `renderer` and use it from the provided parameters of the `render` option.' +
        '\n- If you are using the `render` option to work with React 18, pass an empty `render` function into `renderer`.' +
        '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-render'
    );
    instance.destroy();

    expect(startAutocomplete).not.toWarnDev(
      '[Autocomplete] You provided an incomplete `renderer` (missing: `renderer.Fragment`, `renderer.render`). This can cause rendering issues.' +
        '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-renderer'
    );
    instance.destroy();
  });

  test('does not warn at all when only passing a `render` option', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    let instance;
    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        render({ children, render }, root) {
          render(children, root);
        },
      });
    }).not.toWarnDev();
    instance.destroy();
  });

  test('does not warn at all when passing an empty `renderer.render` function', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);

    document.body.appendChild(panelContainer);

    let instance;
    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        renderer: {
          createElement: mockCreateElement,
          Fragment: CustomFragment,
          render: () => {},
        },
      });
    }).not.toWarnDev();
    instance.destroy();
  });

  test('does not warn at all when not passing a custom renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    let instance;
    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
      });
    }).not.toWarnDev();
    instance.destroy();
  });

  test('does not warn at all when passing a full custom renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const mockRender = jest.fn().mockImplementation(preactRender);

    document.body.appendChild(panelContainer);

    let instance;
    expect(() => {
      instance = autocomplete<{ label: string }>({
        container,
        panelContainer,
        initialState: {
          isOpen: true,
        },
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems() {
                return [{ label: '1' }];
              },
              templates: {
                item({ item }) {
                  return item.label;
                },
              },
            },
          ];
        },
        renderer: {
          createElement: mockCreateElement,
          Fragment: CustomFragment,
          render: mockRender,
        },
      });
    }).not.toWarnDev();
    instance.destroy();
  });
});
