import userEvent from '@testing-library/user-event';

import {
  createCollection,
  createNavigator,
  createPlayground,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('navigator', () => {
  describe('default navigator', () => {
    let focusNewTab;

    beforeEach(() => {
      focusNewTab = jest.fn();
      Object.defineProperty(global, 'location', {
        value: { assign: jest.fn() },
        configurable: true,
      });
      Object.defineProperty(global, 'open', {
        value: jest.fn(() => ({
          focus: focusNewTab,
        })),
        configurable: true,
      });
    });

    function setupTestWithUrlItems() {
      return createPlayground(createAutocomplete, {
        openOnFocus: true,
        defaultActiveItemId: 0,
        initialState: {
          collections: [
            createCollection({
              source: {
                getItemUrl: ({ item }) => item.url,
              },
              items: [{ url: '#1' }, { url: '#2' }],
            }),
          ],
        },
      });
    }

    test('change location on Enter', () => {
      const { inputElement } = setupTestWithUrlItems();

      inputElement.focus();
      userEvent.type(inputElement, '{enter}');

      expect(global.location.assign).toHaveBeenCalledTimes(1);
      expect(global.location.assign).toHaveBeenCalledWith('#1');
    });

    test('open location in new tab on Meta+Enter', () => {
      const { inputElement } = setupTestWithUrlItems();

      inputElement.focus();
      userEvent.type(inputElement, '{meta}{enter}');

      expect(global.open).toHaveBeenCalledTimes(1);
      expect(global.open).toHaveBeenCalledWith('#1', '_blank', 'noopener');
      expect(focusNewTab).toHaveBeenCalledTimes(1);
    });

    test('open location in new tab on Ctrl+Enter', () => {
      const { inputElement } = setupTestWithUrlItems();

      inputElement.focus();
      userEvent.type(inputElement, '{ctrl}{enter}');

      expect(global.open).toHaveBeenCalledTimes(1);
      expect(global.open).toHaveBeenCalledWith('#1', '_blank', 'noopener');
      expect(focusNewTab).toHaveBeenCalledTimes(1);
    });

    test('open location in new window on Shift+Enter', () => {
      const { inputElement } = setupTestWithUrlItems();

      inputElement.focus();
      userEvent.type(inputElement, '{shift}{enter}');

      expect(global.open).toHaveBeenCalledTimes(1);
      expect(global.open).toHaveBeenCalledWith('#1', '_blank', 'noopener');
      expect(focusNewTab).toHaveBeenCalledTimes(0);
    });
  });

  describe('custom navigator', () => {
    describe('without url', () => {
      function setupCustomNavigatorWithoutUrlTest(props) {
        return createPlayground(createAutocomplete, {
          openOnFocus: true,
          defaultActiveItemId: 0,
          initialState: {
            collections: [
              createCollection({
                items: [{ url: '#1' }, { url: '#2' }],
              }),
            ],
          },
          ...props,
        });
      }

      test('triggers navigate on Enter', () => {
        const navigator = createNavigator();
        const { inputElement } = setupCustomNavigatorWithoutUrlTest({
          navigator,
        });

        inputElement.focus();
        userEvent.type(inputElement, '{enter}');

        expect(navigator.navigate).toHaveBeenCalledTimes(0);
      });

      test('triggers navigateNewTab on Meta+Enter', () => {
        const navigator = createNavigator();
        const { inputElement } = setupCustomNavigatorWithoutUrlTest({
          navigator,
        });

        inputElement.focus();
        userEvent.type(inputElement, '{meta}{enter}');

        expect(navigator.navigateNewTab).toHaveBeenCalledTimes(0);
      });

      test('triggers navigateNewTab on Ctrl+Enter', () => {
        const navigator = createNavigator();
        const { inputElement } = setupCustomNavigatorWithoutUrlTest({
          navigator,
        });

        inputElement.focus();
        userEvent.type(inputElement, '{ctrl}{enter}');

        expect(navigator.navigateNewTab).toHaveBeenCalledTimes(0);
      });

      test('triggers navigateNewWindow on Shift+Enter', () => {
        const navigator = createNavigator();
        const { inputElement } = setupCustomNavigatorWithoutUrlTest({
          navigator,
        });

        inputElement.focus();
        userEvent.type(inputElement, '{shift}{enter}');

        expect(navigator.navigateNewWindow).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('with url', () => {
    function setupCustomNavigatorWithUrlTest(props) {
      return createPlayground(createAutocomplete, {
        openOnFocus: true,
        defaultActiveItemId: 0,
        initialState: {
          collections: [
            createCollection({
              source: {
                getItemUrl: ({ item }) => item.url,
              },
              items: [{ url: '#1' }, { url: '#2' }],
            }),
          ],
        },
        ...props,
      });
    }

    test('triggers navigate on Enter', () => {
      const navigator = createNavigator();
      const { inputElement } = setupCustomNavigatorWithUrlTest({ navigator });

      inputElement.focus();
      userEvent.type(inputElement, '{enter}');

      expect(navigator.navigate).toHaveBeenCalledTimes(1);
      expect(navigator.navigate).toHaveBeenCalledWith({
        item: { url: '#1' },
        itemUrl: '#1',
        state: {
          collections: [
            {
              items: [{ url: '#1' }, { url: '#2' }],
              source: expect.any(Object),
            },
          ],
          completion: null,
          context: {},
          isOpen: true,
          query: '',
          activeItemId: 0,
          status: 'loading',
        },
      });
    });

    test('triggers navigateNewTab on Meta+Enter', () => {
      const navigator = createNavigator();
      const { inputElement } = setupCustomNavigatorWithUrlTest({ navigator });

      inputElement.focus();
      userEvent.type(inputElement, '{meta}{enter}');

      expect(navigator.navigateNewTab).toHaveBeenCalledTimes(1);
      expect(navigator.navigateNewTab).toHaveBeenCalledWith({
        item: { url: '#1' },
        itemUrl: '#1',
        state: {
          collections: [
            {
              items: [{ url: '#1' }, { url: '#2' }],
              source: expect.any(Object),
            },
          ],
          completion: null,
          context: {},
          isOpen: true,
          query: '',
          activeItemId: 0,
          status: 'loading',
        },
      });
    });

    test('triggers navigateNewTab on Ctrl+Enter', () => {
      const navigator = createNavigator();
      const { inputElement } = setupCustomNavigatorWithUrlTest({ navigator });

      inputElement.focus();
      userEvent.type(inputElement, '{ctrl}{enter}');

      expect(navigator.navigateNewTab).toHaveBeenCalledTimes(1);
      expect(navigator.navigateNewTab).toHaveBeenCalledWith({
        item: { url: '#1' },
        itemUrl: '#1',
        state: {
          collections: [
            {
              items: [{ url: '#1' }, { url: '#2' }],
              source: expect.any(Object),
            },
          ],
          completion: null,
          context: {},
          isOpen: true,
          query: '',
          activeItemId: 0,
          status: 'loading',
        },
      });
    });

    test('triggers navigateNewWindow on Shift+Enter', () => {
      const navigator = createNavigator();
      const { inputElement } = setupCustomNavigatorWithUrlTest({ navigator });

      inputElement.focus();
      userEvent.type(inputElement, '{shift}{enter}');

      expect(navigator.navigateNewWindow).toHaveBeenCalledTimes(1);
      expect(navigator.navigateNewWindow).toHaveBeenCalledWith({
        item: { url: '#1' },
        itemUrl: '#1',
        state: {
          collections: [
            {
              items: [{ url: '#1' }, { url: '#2' }],
              source: expect.any(Object),
            },
          ],
          completion: null,
          context: {},
          isOpen: true,
          query: '',
          activeItemId: 0,
          status: 'loading',
        },
      });
    });
  });
});
