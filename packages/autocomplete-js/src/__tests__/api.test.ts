import { createAutocomplete } from '@algolia/autocomplete-core';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
  createElement as preactCreateElement,
  render as preactRender,
} from 'preact';

import { createCollection } from '../../../../test/utils';
import { autocomplete } from '../autocomplete';

describe('api', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('setActiveItemId', () => {
    test('sets `activeItemId` value in the state', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setActiveItemId } = autocomplete<{ label: string }>({
        container,
        onStateChange,
      });

      setActiveItemId(1);

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({ activeItemId: 1 }),
        })
      );

      setActiveItemId(null);

      expect(onStateChange).toHaveBeenCalledTimes(2);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({ activeItemId: null }),
        })
      );
    });
  });

  describe('setQuery', () => {
    test('sets `query` value in the state', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setQuery } = autocomplete<{ label: string }>({
        container,
        onStateChange,
      });

      setQuery('query');

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({ query: 'query' }),
        })
      );
    });
  });

  describe('setCollections', () => {
    test('sets the collections', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setCollections } = autocomplete<{ label: string }>({
        container,
        onStateChange,
      });

      const items = [{ label: 'hi' }];
      const collection = createCollection({
        source: {
          getItemInputValue: ({ item }) => item.label,
          getItemUrl: () => undefined,
          onActive: () => {},
          onSelect: () => {},
          getItems: () => items,
          templates: {},
        },
        items,
      });

      setCollections([collection]);

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            collections: [
              {
                items: [
                  {
                    label: 'hi',
                    __autocomplete_id: 0,
                  },
                ],
                source: expect.any(Object),
              },
            ],
          }),
        })
      );
    });

    test('flattens the collections', () => {
      const onStateChange = jest.fn();
      const { setCollections } = createAutocomplete({
        openOnFocus: true,
        onStateChange,
      });

      const items = [{ label: 'hi' }];
      const collection = createCollection({
        source: {
          getItemInputValue: ({ item }) => item.label,
          getItemUrl: () => undefined,
          onActive: () => {},
          onSelect: () => {},
          getItems: () => items,
          templates: {},
        },
        items,
      });

      setCollections([collection]);

      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            collections: [
              expect.objectContaining({
                items: [{ label: 'hi', __autocomplete_id: 0 }],
              }),
            ],
          }),
        })
      );
    });
  });

  describe('setIsOpen', () => {
    test('sets `isOpen` value in the state', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setIsOpen } = autocomplete<{ label: string }>({
        container,
        onStateChange,
      });

      setIsOpen(true);

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({ isOpen: true }),
        })
      );

      setIsOpen(false);

      expect(onStateChange).toHaveBeenCalledTimes(2);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({ isOpen: false }),
        })
      );
    });
  });

  describe('setStatus', () => {
    test('sets `status` value in the state', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setStatus } = autocomplete<{ label: string }>({
        container,
        onStateChange,
      });

      setStatus('loading');

      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({ status: 'loading' }),
        })
      );
    });
  });

  describe('setContext', () => {
    test('aggregates `context` values in the state', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setContext } = autocomplete<{ label: string }>({
        container,
        onStateChange,
      });

      setContext({
        firstContext: 'firstContextValue',
      });
      setContext({
        secondContext: 'secondContextValue',
      });

      expect(onStateChange).toHaveBeenCalledTimes(2);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            context: {
              firstContext: 'firstContextValue',
              secondContext: 'secondContextValue',
            },
          }),
        })
      );
    });
  });

  describe('update', () => {
    test('merges new options with original ones', () => {
      let inputElement: HTMLInputElement;
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      document.body.appendChild(container);
      const { update } = autocomplete<{ label: string }>({
        container,
        onStateChange,
        shouldPanelOpen: () => true,
      });

      // Focusing the input should do nothing (`openOnFocus` is false)
      inputElement = container.querySelector('.aa-Input');
      inputElement.focus();

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            isOpen: false,
          }),
        })
      );

      // Update options (set `openOnFocus` to true)
      update({
        openOnFocus: true,
      });

      // Focusing the input should open the panel (`openOnFocus` is now true)
      inputElement = container.querySelector('.aa-Input');
      inputElement.focus();

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            isOpen: true,
          }),
        })
      );
    });

    test('correctly merges DOM Element options', async () => {
      let inputElement: HTMLInputElement;
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      document.body.appendChild(container);
      const panelContainer = document.createElement('div');
      document.body.appendChild(panelContainer);
      const panelContainer2 = document.createElement('div');
      document.body.appendChild(panelContainer2);

      const { update } = autocomplete<{ label: string }>({
        container,
        onStateChange,
        panelContainer,
        shouldPanelOpen: () => true,
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
      });

      // Focusing the input should render the panel
      inputElement = container.querySelector('.aa-Input');
      inputElement.focus();

      // Focusing the input should open the panel
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            isOpen: true,
          }),
        })
      );

      // Panel is rendered into the original container
      await waitFor(() => {
        expect(
          panelContainer.querySelector<HTMLElement>('.aa-Panel')
        ).toHaveTextContent('No results template');
      });

      // Update options (set `panelContainer` to a different element)
      update({
        panelContainer: panelContainer2,
      });

      // Focusing the input should render the panel
      inputElement = container.querySelector('.aa-Input');
      inputElement.focus();

      // Panel is rendered into the new container
      await waitFor(() => {
        expect(
          panelContainer2.querySelector<HTMLElement>('.aa-Panel')
        ).toHaveTextContent('No results template');
      });
    });

    test('overrides the default id', async () => {
      const container = document.createElement('div');

      document.body.appendChild(container);
      const { update } = autocomplete<{ label: string }>({
        container,
      });

      update({ id: 'bestSearchExperience' });

      await waitFor(() => {
        expect(
          document.body.querySelector('#bestSearchExperience-label')
        ).toBeInTheDocument();
      });
    });

    test('overrides the default translations', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const { update } = autocomplete<{ label: string }>({
        container,
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Submit');

      update({
        translations: {
          submitButtonTitle: 'Envoyer',
        },
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Envoyer');
    });

    test('updates the renderer', async () => {
      const container = document.createElement('div');
      const panelContainer = document.createElement('div');
      document.body.appendChild(container);
      document.body.appendChild(panelContainer);

      const CustomFragment = (props: any) => props.children;
      const mockCreateElement1 = jest.fn(preactCreateElement);
      const mockCreateElement2 = jest.fn(preactCreateElement);
      const mockRender = jest.fn().mockImplementation(preactRender);

      const { update } = autocomplete<{ label: string }>({
        container,
        panelContainer,
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems({ query }) {
                return [{ label: query }];
              },
              templates: {
                item({ item, components, html }) {
                  return html`<div>
                    ${components.Highlight({ hit: item, attribute: 'label' })}
                  </div>`;
                },
              },
            },
          ];
        },
        renderer: {
          Fragment: CustomFragment,
          render: mockRender,
          createElement: mockCreateElement1,
        },
      });

      const input = container.querySelector<HTMLInputElement>('.aa-Input');

      fireEvent.input(input, { target: { value: 'apple' } });

      await waitFor(() => {
        expect(
          panelContainer.querySelector<HTMLElement>('.aa-Panel')
        ).toHaveTextContent('apple');
        expect(mockCreateElement1).toHaveBeenCalled();
      });

      mockCreateElement1.mockClear();

      update({
        renderer: {
          Fragment: CustomFragment,
          render: mockRender,
          createElement: mockCreateElement2,
        },
      });

      fireEvent.input(input, { target: { value: 'iphone' } });

      await waitFor(() => {
        expect(
          panelContainer.querySelector<HTMLElement>('.aa-Panel')
        ).toHaveTextContent('iphone');
        // The `createElement` function was updated, so the previous
        // implementation should no longer be called.
        expect(mockCreateElement1).not.toHaveBeenCalled();
        expect(mockCreateElement2).toHaveBeenCalled();
      });
    });

    test('preserves all user `components` when not updated', async () => {
      const container = document.createElement('div');
      const panelContainer = document.createElement('div');
      document.body.appendChild(container);
      document.body.appendChild(panelContainer);

      const CustomFragment = (props: any) => props.children;
      const mockCreateElement1 = jest.fn(preactCreateElement);
      const mockCreateElement2 = jest.fn(preactCreateElement);
      const mockRender = jest.fn().mockImplementation(preactRender);
      const CustomHighlight = jest.fn((props: { hit: { label: string } }) =>
        mockCreateElement1(CustomFragment, null, props.hit.label)
      );
      const MyComponent = (props: any) => props.children;

      const { update } = autocomplete<{ label: string }>({
        container,
        panelContainer,
        getSources() {
          return [
            {
              sourceId: 'testSource',
              getItems({ query }) {
                return [{ label: query }];
              },
              templates: {
                item({ item, components, html }) {
                  return html`<div>
                    ${components.Highlight({ hit: item, attribute: 'label' })}
                    ${components.MyComponent({ children: item.label })}
                  </div>`;
                },
              },
            },
          ];
        },
        components: { Highlight: CustomHighlight, MyComponent },
        renderer: {
          Fragment: CustomFragment,
          render: mockRender,
          createElement: mockCreateElement1,
        },
      });

      update({
        renderer: {
          Fragment: CustomFragment,
          render: mockRender,
          createElement: mockCreateElement2,
        },
      });

      mockCreateElement1.mockClear();

      const input = container.querySelector<HTMLInputElement>('.aa-Input');

      fireEvent.input(input, { target: { value: 'iphone' } });

      await waitFor(() => {
        expect(
          panelContainer.querySelector<HTMLElement>('.aa-Panel')
        ).toHaveTextContent('iphone');
        // The custom `Highlight` component wasn't updated, so the previous
        // `createElement` implementation is still being called.
        expect(mockCreateElement1).toHaveBeenCalledTimes(1);
        expect(mockCreateElement2).toHaveBeenCalled();
      });
    });
  });

  describe('destroy', () => {
    test('clears all effects', () => {
      const windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const windowRemoveEventListenerSpy = jest.spyOn(
        window,
        'removeEventListener'
      );
      const container = document.createElement('div');
      const { destroy } = autocomplete<{ label: string }>({
        container,
      });

      destroy();

      // Use one side effect (event listeners on window) to check that all events where cleared
      expect(windowRemoveEventListenerSpy.mock.calls.length).toEqual(
        windowAddEventListenerSpy.mock.calls.length
      );
    });
  });
});
