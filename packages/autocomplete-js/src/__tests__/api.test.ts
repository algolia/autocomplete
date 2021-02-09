import { fireEvent, waitFor } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';
import {
  createAutocomplete,
  AutocompleteCollection,
} from '@algolia/autocomplete-core';

function createCollection(items) {
  return {
    source: {
      getItemInputValue: ({ item }) => item.label,
      getItemUrl: () => undefined,
      onActive: () => {},
      onSelect: () => {},
      getItems: () => items,
      templates: {},
    },
    items,
  };
}

describe('api', () => {
  describe('setActiveItemId', () => {
    test('sets `activeItemId` value in the state', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setActiveItemId } = autocomplete<{ label: string }>({
        id: 'autocomplete',
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
        id: 'autocomplete',
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
        id: 'autocomplete',
        container,
        onStateChange,
      });

      setCollections([createCollection([{ label: 'hi' }])]);

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

      setCollections([createCollection([[{ label: 'hi' }]])]);

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
        id: 'autocomplete',
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
        id: 'autocomplete',
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
    test('aggregate `context` values in the state', () => {
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      const { setContext } = autocomplete<{ label: string }>({
        id: 'autocomplete',
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
    test('merge new options with original ones', () => {
      let inputElement: HTMLInputElement;
      const onStateChange = jest.fn();
      const container = document.createElement('div');
      document.body.appendChild(container);
      const { update } = autocomplete<{ label: string }>({
        id: 'autocomplete',
        container,
        onStateChange,
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
  });

  describe('destroy', () => {
    test('clear all effects', () => {
      const windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const windowRemoveEventListenerSpy = jest.spyOn(
        window,
        'removeEventListener'
      );
      const container = document.createElement('div');
      const { destroy } = autocomplete<{ label: string }>({
        id: 'autocomplete',
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
