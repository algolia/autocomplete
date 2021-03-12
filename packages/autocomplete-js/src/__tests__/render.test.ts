import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createElement as preactCreateElement,
  Fragment as PreactFragment,
  render,
} from 'preact';

import { autocomplete } from '../autocomplete';

describe('render', () => {
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
        render(createElement('div', null, 'testSource'), root);
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

  test('provides the panel as root', async () => {
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
        expect(panelContainer.querySelector<HTMLElement>('.aa-Panel')).toBe(
          root
        );
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
      render({ elements, createElement }, root) {
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
      render({ sections, createElement }, root) {
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
      render({ createElement, children }, root) {
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

  test('provides a default createElement', async () => {
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
        expect(createElement).toBe(preactCreateElement);
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

  test('provides a default Fragment', async () => {
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
      render({ createElement, Fragment }, root) {
        expect(Fragment).toBe(PreactFragment);
        render(createElement(Fragment, null, 'testSource'), root);
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

  test('retrieves the custom createElement from the renderer', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');
    const mockCreateElement = jest.fn().mockImplementation(preactCreateElement);

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
        expect(createElement).toBe(mockCreateElement);
        render(createElement('div', null, 'testSource'), root);
      },
      renderer: {
        createElement: mockCreateElement,
        Fragment: PreactFragment,
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

  test('retrieves the custom Fragment from the renderer', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    const customFragment = (props: any) => props.children;

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
      render({ createElement, Fragment }, root) {
        expect(Fragment).toBe(customFragment);
        render(createElement(Fragment, null, 'testSource'), root);
      },
      renderer: {
        createElement: preactCreateElement,
        Fragment: customFragment,
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
});
