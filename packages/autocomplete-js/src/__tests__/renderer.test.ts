import { warnCache } from '@algolia/autocomplete-shared';
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
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
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
      renderNoResults({ createElement, Fragment, render }, root) {
        expect(createElement).toBe(preactCreateElement);
        expect(Fragment).toBe(PreactFragment);
        expect(render).toBe(preactRender);

        render(createElement(Fragment, null, 'testSource'), root);
      },
    });
  });

  test('accepts a custom renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const mockRender = jest.fn().mockImplementation(preactRender);

    document.body.appendChild(panelContainer);

    autocomplete<{ label: string }>({
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
      renderNoResults(
        { children, createElement, Fragment, render, html },
        root
      ) {
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
  });

  test('defaults `render` when not specified in the renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);

    document.body.appendChild(panelContainer);

    autocomplete<{ label: string }>({
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
      renderNoResults({ createElement, Fragment, render }, root) {
        expect(render).toBe(preactRender);

        preactRender(createElement(Fragment, null, 'testSource'), root);
      },
      renderer: {
        createElement: mockCreateElement,
        Fragment: CustomFragment,
      },
    });
  });

  test('warns about renderer mismatch when specifying an incomplete renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const CustomFragment = (props: any) => props.children;
    const mockRender = jest.fn().mockImplementation(preactRender);

    document.body.appendChild(panelContainer);

    expect(() => {
      autocomplete<{ label: string }>({
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

    expect(() => {
      autocomplete<{ label: string }>({
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

    expect(() => {
      autocomplete<{ label: string }>({
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

    expect(() => {
      autocomplete<{ label: string }>({
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
  });

  test('warns about new `renderer.render` option when specifying an incomplete renderer and a `render` option', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const CustomFragment = (props: any) => props.children;

    document.body.appendChild(panelContainer);

    function startAutocomplete() {
      autocomplete<{ label: string }>({
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
        "\n - If you are using the `render` option only to override Autocomplete's default `render` function, pass the `render` function into `renderer` and remove the `render` option." +
        '\n - If you are using the `render` option to customize the layout, pass your `render` function into `renderer` and use it from the provided parameters of the `render` option.' +
        '\n See https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-render'
    );

    expect(startAutocomplete).not.toWarnDev(
      '[Autocomplete] You provided an incomplete `renderer` (missing: `renderer.Fragment`, `renderer.render`). This can cause rendering issues.' +
        '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-renderer'
    );
  });

  test('does not warn at all when not passing a custom renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    expect(() => {
      autocomplete<{ label: string }>({
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
  });

  test('does not warn at all when passing a full custom renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);
    const mockRender = jest.fn().mockImplementation(preactRender);

    document.body.appendChild(panelContainer);

    expect(() => {
      autocomplete<{ label: string }>({
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
  });
});
