import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createElement as preactCreateElement,
  Fragment,
  Fragment as PreactFragment,
  render as preactRender,
} from 'preact';

import { autocomplete } from '../autocomplete';

describe('render', () => {
  const sourceId1 = 'testSource1';
  const sourceId2 = 'testSource2';

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('provides a default implementation', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
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

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();

      expect(panelContainer).toHaveTextContent('1');
    });
  });

  test('accepts a custom render method', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
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
      render({ createElement }, root) {
        preactRender(createElement('div', null, 'testSource'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
      expect(panelContainer).toHaveTextContent('testSource');
    });
  });

  test('provides the panel as root', () => {
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
      render({ createElement }, root) {
        expect(panelContainer.querySelector<HTMLElement>('.aa-Panel')).toBe(
          root
        );
        preactRender(createElement('div', null, 'testSource'), root);
      },
    });
  });

  test('provides the state', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
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
      render({ state, createElement }, root) {
        expect(state).toEqual({
          activeItemId: null,
          collections: [
            { source: expect.any(Object), items: expect.any(Array) },
          ],
          context: expect.any(Object),
          isOpen: expect.any(Boolean),
          query: expect.any(String),
          status: expect.any(String),
          completion: null,
        });

        preactRender(createElement('div', null, 'testSource'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });
  });

  test('provides the elements', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      getSources() {
        return [
          {
            sourceId: sourceId1,
            getItems() {
              return [{ label: '1' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
          {
            sourceId: sourceId2,
            getItems() {
              return [{ label: '2' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ elements, createElement }, root) {
        expect(elements).toEqual({
          [sourceId1]: expect.objectContaining({
            type: 'section',
            props: {
              className: expect.any(String),
              'data-autocomplete-source-id': sourceId1,
              children: expect.any(Array),
            },
          }),
          [sourceId2]: expect.objectContaining({
            type: 'section',
            props: {
              className: expect.any(String),
              'data-autocomplete-source-id': sourceId2,
              children: expect.any(Array),
            },
          }),
        });

        preactRender(createElement('div', null, 'testSource'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });
  });

  test('provides the sections', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      getSources() {
        return [
          {
            sourceId: sourceId1,
            getItems() {
              return [{ label: '1' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
          {
            sourceId: sourceId2,
            getItems() {
              return [{ label: '2' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ sections, createElement }, root) {
        expect(sections).toEqual([
          expect.objectContaining({
            type: 'section',
            props: {
              className: expect.any(String),
              'data-autocomplete-source-id': sourceId1,
              children: expect.any(Array),
            },
          }),
          expect.objectContaining({
            type: 'section',
            props: {
              className: expect.any(String),
              'data-autocomplete-source-id': sourceId2,
              children: expect.any(Array),
            },
          }),
        ]);

        preactRender(createElement('div', null, 'testSource'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });
  });

  test('provides the children', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
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
          {
            sourceId: 'testSource2',
            getItems() {
              return [{ label: '2' }];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      render({ createElement, children, sections }, root) {
        expect(children).toEqual(
          expect.objectContaining({
            type: Fragment,
            props: {
              children: [
                expect.objectContaining({
                  props: {
                    className: 'aa-PanelLayout aa-Panel--scrollable',
                    children: sections,
                  },
                }),
                expect.objectContaining({
                  props: {
                    className: 'aa-GradientBottom',
                  },
                }),
              ],
            },
          })
        );
        preactRender(createElement('div', null, 'testSource'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });
  });

  test('provides a default createElement', () => {
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
      render({ createElement }, root) {
        expect(createElement).toBe(preactCreateElement);
        preactRender(createElement('div', null, 'testSource'), root);
      },
    });
  });

  test('provides a default Fragment', () => {
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
      render({ createElement, Fragment }, root) {
        expect(Fragment).toBe(PreactFragment);
        preactRender(createElement(Fragment, null, 'testSource'), root);
      },
    });
  });

  test('provides a default `render`', () => {
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
      render({ render }, root) {
        expect(render).toBe(preactRender);
        render(null, root);
      },
    });
  });

  test('provides an `html` function', () => {
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
      render({ children, render, html }, root) {
        expect(html).toBeDefined();
        render(html`<div>${children}</div>`, root);
      },
    });
  });

  test('retrieves the custom createElement from the renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
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
      render({ createElement }, root) {
        expect(createElement).toBe(mockCreateElement);
        preactRender(createElement('div', null, 'testSource'), root);
      },
      renderer: {
        createElement: mockCreateElement,
        Fragment: PreactFragment,
      },
    });
  });

  test('retrieves the custom Fragment from the renderer', () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const CustomFragment = (props: any) => props.children;

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
      render({ createElement, Fragment }, root) {
        expect(Fragment).toBe(CustomFragment);
        preactRender(createElement(Fragment, null, 'testSource'), root);
      },
      renderer: {
        createElement: preactCreateElement,
        Fragment: CustomFragment,
      },
    });
  });

  test('provides the scoped API', () => {
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
      render(params) {
        expect(params).toEqual(
          expect.objectContaining({
            refresh: expect.any(Function),
            setActiveItemId: expect.any(Function),
            setCollections: expect.any(Function),
            setContext: expect.any(Function),
            setIsOpen: expect.any(Function),
            setQuery: expect.any(Function),
            setStatus: expect.any(Function),
          })
        );
      },
    });
  });

  test('does not render the sections without results and noResults template on multi sources', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      getSources() {
        return [
          {
            sourceId: sourceId1,
            getItems() {
              return [];
            },
            templates: {
              header() {
                return sourceId1;
              },
              item({ item }) {
                return item.label;
              },
              footer() {
                return sourceId1;
              },
            },
          },
          {
            sourceId: sourceId2,
            getItems() {
              return [{ label: '2' }];
            },
            templates: {
              header() {
                return sourceId2;
              },
              item({ item }) {
                return item.label;
              },
              footer() {
                return sourceId2;
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();

      expect(
        panelContainer.querySelector(
          `[data-autocomplete-source-id="${sourceId1}"]`
        )
      ).not.toBeInTheDocument();
      expect(
        panelContainer.querySelector(
          `[data-autocomplete-source-id="${sourceId2}"]`
        )
      ).toBeInTheDocument();
    });
  });
});
