import { createAutocomplete } from '@algolia/autocomplete-core';
import { waitFor } from '@testing-library/dom';

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

      const ac = autocomplete<{ label: string }>({
        container,
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Submit');

      ac.update({
        translations: {
          submitButtonTitle: 'Envoyer',
        },
      });

      expect(
        document.querySelector<HTMLButtonElement>('.aa-SubmitButton')
      ).toHaveAttribute('title', 'Envoyer');
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
