import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createElement as preactCreateElement,
  Fragment as PreactFragment,
  render,
} from 'preact';

import { autocomplete } from '../autocomplete';

describe('renderNoResults', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('renders when no results are returned', async () => {
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
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      renderNoResults({ createElement }, root) {
        render(createElement('div', null, 'No results render'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toHaveTextContent('No results render');
    });
  });

  test("doesn't render with a closed panel", async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete<{ label: string }>({
      container,
      panelContainer,
      openOnFocus: true,
      shouldPanelOpen: () => false,
      getSources() {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
            },
          },
        ];
      },
      renderNoResults({ createElement }, root) {
        render(createElement('div', null, 'No results render'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).not.toBeInTheDocument();
    });
  });

  test('renders noResults template over renderNoResults method on no results', async () => {
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
              return [];
            },
            templates: {
              item({ item }) {
                return item.label;
              },
              noResults() {
                return 'No results template';
              },
            },
          },
        ];
      },
      renderNoResults({ createElement }, root) {
        render(createElement('div', null, 'No results method'), root);
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toHaveTextContent('No results template');
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
      renderNoResults({ createElement }, root) {
        expect(panelContainer.querySelector<HTMLElement>('.aa-Panel')).toBe(
          root
        );
        render(createElement('div', null, 'No results render'), root);
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
      renderNoResults({ state, createElement }, root) {
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

        render(createElement('div', null, 'No results render'), root);
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
    const sourceId = 'testSource';
    const sourceId2 = 'testSource2';
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
            sourceId,
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
      renderNoResults({ elements, createElement }, root) {
        expect(elements).toEqual({
          [sourceId]: expect.objectContaining({
            type: 'section',
            props: {
              className: expect.any(String),
              'data-autocomplete-source-id': sourceId,
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

        render(createElement('div', null, 'testSource'), root);
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
    const sourceId = 'testSource';
    const sourceId2 = 'testSource2';
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
            sourceId,
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
      renderNoResults({ sections, createElement }, root) {
        expect(sections).toEqual([
          expect.objectContaining({
            type: 'section',
            props: {
              className: expect.any(String),
              'data-autocomplete-source-id': sourceId,
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

        render(createElement('div', null, 'No results render'), root);
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
      renderNoResults({ createElement, children }, root) {
        expect(children).toEqual(
          expect.objectContaining({
            type: 'div',
            props: {
              className: expect.any(String),
              children: expect.arrayContaining([
                expect.any(Object),
                expect.any(Object),
              ]),
            },
          })
        );
        render(createElement('div', null, 'No results render'), root);
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
      renderNoResults({ createElement }, root) {
        expect(createElement).toBe(preactCreateElement);
        render(createElement('div', null, 'No results render'), root);
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
      renderNoResults({ createElement, Fragment }, root) {
        expect(Fragment).toBe(PreactFragment);
        render(createElement(Fragment, null, 'No results render'), root);
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
      renderNoResults({ createElement }, root) {
        expect(createElement).toBe(mockCreateElement);
        render(createElement('div', null, 'No results render'), root);
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

    const customFragment = (props: any) => props.children;

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
      renderNoResults({ createElement, Fragment }, root) {
        expect(Fragment).toBe(customFragment);
        render(createElement(Fragment, null, 'No results render'), root);
      },
      renderer: {
        createElement: preactCreateElement,
        Fragment: customFragment,
      },
    });
  });
});
