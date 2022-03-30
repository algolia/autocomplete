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

        preactRender(createElement(Fragment, null, 'testSource'), root);
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
      render({ createElement, Fragment, render }, root) {
        expect(createElement).toBe(mockCreateElement);
        expect(Fragment).toBe(CustomFragment);
        expect(mockCreateElement).toHaveBeenCalled();

        render(createElement(Fragment, null, 'testSource'), root);
      },
      renderer: {
        createElement: mockCreateElement,
        Fragment: CustomFragment,
        render: mockRender,
      },
    });
  });
});
