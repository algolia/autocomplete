import userEvent from '@testing-library/user-event';

import {
  createCollection,
  createPlayground,
  createSource,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getInputProps', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('forwards the remaining props', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement, customProps: {} });

    expect(inputProps).toEqual(expect.objectContaining({ customProps: {} }));
  });

  test('returns aria-autocomplete to both', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-autocomplete']).toEqual('both');
  });

  test('returns undefined aria-activedescendant when panel is closed', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-activedescendant']).toBeUndefined();
  });

  test('returns undefined aria-activedescendant when panel is open and but no selected item', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        initialState: {
          isOpen: true,
          selectedItemId: null,
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-activedescendant']).toBeUndefined();
  });

  test('returns aria-activedescendant with item ID when panel is open', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        id: 'autocomplete',
        initialState: {
          isOpen: true,
          selectedItemId: 0,
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-activedescendant']).toEqual('autocomplete-item-0');
  });

  test('returns undefined aria-controls when panel is closed', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-controls']).toBeUndefined();
  });

  test('returns aria-controls with list ID when panel is open', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      { id: 'autocomplete', initialState: { isOpen: true } }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-controls']).toEqual('autocomplete-list');
  });

  test('returns aria-labelledby with label ID', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        id: 'autocomplete',
        initialState: { isOpen: true },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-labelledby']).toEqual('autocomplete-label');
  });

  test('returns completion as value if exists', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        initialState: {
          query: 'i',
          completion: 'ipa',
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.value).toEqual('ipa');
  });

  test('returns value', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        initialState: {
          query: 'i',
          completion: null,
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.value).toEqual('i');
  });

  test('returns id with input ID', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        id: 'autocomplete',
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.id).toEqual('autocomplete-input');
  });

  test('returns autoComplete to off', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoComplete).toEqual('off');
  });

  test('returns autoCorrect to off', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoCorrect).toEqual('off');
  });

  test('returns autoCapitalize to off', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoCapitalize).toEqual('off');
  });

  test('returns spellCheck to false', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.spellCheck).toEqual('false');
  });

  test('returns autoFocus to false by default', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoFocus).toEqual(false);
  });

  test('returns autoFocus to true with autoFocus prop', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      { autoFocus: true }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.autoFocus).toEqual(true);
  });

  test('returns placeholder with placeholder prop', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      { placeholder: 'My placeholder' }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.placeholder).toEqual('My placeholder');
  });

  test('returns default maxLength to 512', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.maxLength).toEqual(512);
  });

  test('returns custom maxLength', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement, maxLength: 60 });

    expect(inputProps.maxLength).toEqual(60);
  });

  test('returns search type', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {}
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.type).toEqual('search');
  });

  describe('onChange', () => {
    test('sets the query', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
      });

      userEvent.type(inputElement, 'a');

      expect(onStateChange).toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          query: 'a',
        }),
      });
    });

    test('sets selectedItemId to defaultSelectedItemId', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
        defaultSelectedItemId: 0,
      });

      userEvent.type(inputElement, 'a');

      expect(onStateChange).toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          selectedItemId: 0,
        }),
      });
    });

    test('resets the state without query', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
      });

      userEvent.type(inputElement, '');

      expect(onStateChange).not.toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          status: 'loading',
        }),
      });
      expect(onStateChange).toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          status: 'idle',
          collections: [],
          isOpen: false,
        }),
      });
    });

    test('sets the status to loading before fetching sources', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
      });

      userEvent.type(inputElement, 'a');

      expect(onStateChange).toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          status: 'loading',
        }),
      });
    });

    test('calls getSources', () => {
      const onStateChange = jest.fn();
      const getSources = jest.fn((..._args: any[]) => {
        return [
          createSource({
            getItems() {
              return [{ label: '1' }, { label: '2' }];
            },
          }),
        ];
      });
      const {
        inputElement,
        refresh,
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setSelectedItemId,
        setStatus,
      } = createPlayground(createAutocomplete, {
        onStateChange,
        getSources,
      });

      userEvent.type(inputElement, 'a');

      expect(getSources).toHaveBeenCalledWith({
        query: 'a',
        refresh,
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setSelectedItemId,
        setStatus,
        state: {
          collections: [],
          completion: null,
          context: {},
          isOpen: false,
          query: 'a',
          selectedItemId: null,
          status: 'loading',
        },
      });
    });

    test('fetches sources that return collections opens panel', async () => {
      const onStateChange = jest.fn();
      const getSources = jest.fn((..._args: any[]) => {
        return [
          createSource({
            getItems() {
              return [{ label: '1' }, { label: '2' }];
            },
          }),
        ];
      });
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
        getSources,
      });

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      expect(onStateChange).toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          status: 'idle',
          isOpen: true,
          collections: [
            {
              source: expect.any(Object),
              items: [
                { label: '1', __autocomplete_id: 0 },
                { label: '2', __autocomplete_id: 1 },
              ],
            },
          ],
        }),
      });
    });

    test('fetches sources that do not return collections closes panel', async () => {
      const onStateChange = jest.fn();
      const getSources = jest.fn((..._args: any[]) => {
        return [
          createSource({
            getItems() {
              return [];
            },
          }),
        ];
      });
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
        getSources,
      });

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      expect(onStateChange).toHaveBeenLastCalledWith({
        prevState: expect.anything(),
        state: expect.objectContaining({
          status: 'idle',
          isOpen: false,
          collections: [
            {
              source: expect.any(Object),
              items: [],
            },
          ],
        }),
      });
    });

    test('calls onHighlight', async () => {
      const onStateChange = jest.fn();
      const onHighlight = jest.fn();
      const getSources = jest.fn((..._args: any[]) => {
        return [
          createSource({
            getItems() {
              return [{ label: '1' }, { label: '2' }];
            },
            onHighlight,
          }),
        ];
      });
      const {
        inputElement,
        refresh,
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setSelectedItemId,
        setStatus,
      } = createPlayground(createAutocomplete, {
        defaultSelectedItemId: 0,
        onStateChange,
        getSources,
      });

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      expect(onHighlight).toHaveBeenCalledTimes(1);
      expect(onHighlight).toHaveBeenCalledWith({
        event: expect.any(Event),
        item: { label: '1', __autocomplete_id: 0 },
        itemInputValue: 'a',
        itemUrl: undefined,
        refresh,
        source: expect.any(Object),
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setSelectedItemId,
        setStatus,
        state: {
          collections: [
            {
              source: expect.any(Object),
              items: [
                { label: '1', __autocomplete_id: 0 },
                { label: '2', __autocomplete_id: 1 },
              ],
            },
          ],
          completion: null,
          context: {},
          isOpen: true,
          query: 'a',
          selectedItemId: 0,
          status: 'idle',
        },
      });
    });

    test.todo('catches errors and sets status to error');

    test('clears stalled timeout', async () => {
      const environment = {
        ...global,
        setTimeout: jest.fn(() => 999),
        clearTimeout: jest.fn(),
      };

      const { inputElement } = createPlayground(createAutocomplete, {
        environment,
      });

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      expect(environment.clearTimeout).toHaveBeenLastCalledWith(999);
    });
  });

  describe('onKeyDown', () => {
    describe('ArrowUp/ArrowDown', () => {
      test('prevents the default event behavior', () => {
        const { inputProps } = createPlayground(createAutocomplete, {
          openOnFocus: true,
          initialState: {
            collections: [
              createCollection({
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        const event = {
          ...new KeyboardEvent('keydown'),
          key: 'ArrowDown',
          preventDefault: jest.fn(),
        };

        inputProps.onKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
      });

      function setupTestWithItem(props) {
        const playground = createPlayground(createAutocomplete, {
          id: 'autocomplete',
          openOnFocus: true,
          initialState: {
            collections: [
              createCollection({
                items: [{ label: '1' }],
              }),
            ],
          },
          ...props,
        });
        const item = document.createElement('div');
        item.setAttribute('id', 'autocomplete-item-0');
        document.body.appendChild(item);

        return { ...playground, item };
      }

      test('scrolls to the selected item with scrollIntoViewIfNeeded fallback with ArrowDown', () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({ onStateChange });
        (item as any).scrollIntoViewIfNeeded = jest.fn();

        inputElement.focus();
        userEvent.type(inputElement, '{arrowdown}');

        expect((item as any).scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
        expect((item as any).scrollIntoViewIfNeeded).toHaveBeenCalledWith(
          false
        );
      });

      test('scrolls to the selected item with scrollIntoViewIfNeeded fallback with ArrowUp', () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({ onStateChange });
        (item as any).scrollIntoViewIfNeeded = jest.fn();

        inputElement.focus();
        userEvent.type(inputElement, '{arrowup}');

        expect((item as any).scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
        expect((item as any).scrollIntoViewIfNeeded).toHaveBeenCalledWith(
          false
        );
      });

      test('scrolls to the selected item with scrollIntoView fallback with ArrowDown', () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({ onStateChange });
        item.scrollIntoView = jest.fn();

        inputElement.focus();
        userEvent.type(inputElement, '{arrowdown}');

        expect(item.scrollIntoView).toHaveBeenCalledTimes(1);
        expect(item.scrollIntoView).toHaveBeenCalledWith(false);
      });

      test('scrolls to the selected item with scrollIntoView fallback with ArrowUp', () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({ onStateChange });
        item.scrollIntoView = jest.fn();

        inputElement.focus();
        userEvent.type(inputElement, '{arrowup}');

        expect(item.scrollIntoView).toHaveBeenCalledTimes(1);
        expect(item.scrollIntoView).toHaveBeenCalledWith(false);
      });

      test('calls onHighlight when selectedItemId', () => {
        const onStateChange = jest.fn();
        const onHighlight = jest.fn();
        const {
          inputElement,
          refresh,
          setCollections,
          setContext,
          setIsOpen,
          setQuery,
          setSelectedItemId,
          setStatus,
        } = createPlayground(createAutocomplete, {
          openOnFocus: true,
          onStateChange,
          initialState: {
            collections: [
              createCollection({
                source: { onHighlight },
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        inputElement.focus();
        userEvent.type(inputElement, 'a{arrowdown}');

        expect(onHighlight).toHaveBeenCalledTimes(1);
        expect(onHighlight).toHaveBeenCalledWith({
          event: expect.any(Event),
          item: { label: '1' },
          itemInputValue: 'a',
          itemUrl: undefined,
          source: expect.any(Object),
          refresh,
          setCollections,
          setContext,
          setIsOpen,
          setQuery,
          setSelectedItemId,
          setStatus,
          state: {
            collections: [
              {
                source: expect.any(Object),
                items: [{ label: '1' }, { label: '2' }],
              },
            ],
            completion: 'a',
            context: {},
            isOpen: true,
            query: 'a',
            selectedItemId: 0,
            status: 'loading',
          },
        });
      });

      test('does not call onHighlight when no selectedItemId', () => {
        const onStateChange = jest.fn();
        const onHighlight = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          openOnFocus: true,
          onStateChange,
          initialState: {
            collections: [
              createCollection({
                source: { onHighlight },
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        inputElement.focus();
        expect(onHighlight).toHaveBeenCalledTimes(0);

        userEvent.type(inputElement, '{arrowdown}');
        expect(onHighlight).toHaveBeenCalledTimes(1);

        userEvent.type(inputElement, '{arrowup}');
        expect(onHighlight).toHaveBeenCalledTimes(1);
      });
    });

    describe('Escape', () => {
      test('prevents the default event behavior', () => {
        const { inputProps } = createPlayground(createAutocomplete, {
          openOnFocus: true,
          initialState: {
            collections: [
              createCollection({
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        const event = {
          ...new KeyboardEvent('keydown'),
          key: 'Escape',
          preventDefault: jest.fn(),
        };

        inputProps.onKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
      });

      test('closes the panel and resets completion when panel is open', () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          initialState: {
            completion: 'a',
            collections: [
              createCollection({
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        inputElement.focus();
        userEvent.type(inputElement, '{esc}');

        expect(onStateChange).toHaveBeenLastCalledWith({
          prevState: expect.anything(),
          state: expect.objectContaining({
            isOpen: false,
            completion: null,
          }),
        });
      });

      test('resets the state when panel is closed', () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          initialState: {
            isOpen: true,
            collections: [
              createCollection({
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        userEvent.type(inputElement, '{esc}');

        expect(onStateChange).toHaveBeenLastCalledWith({
          prevState: expect.anything(),
          state: expect.objectContaining({
            query: '',
            status: 'idle',
            collections: [],
          }),
        });
      });
    });

    describe('Enter', () => {
      test('is a noop without selectedItemId', () => {
        const onStateChange = jest.fn();
        const { inputProps } = createPlayground(createAutocomplete, {
          onStateChange,
          initialState: {
            isOpen: true,
            selectedItemId: null,
            collections: [
              createCollection({
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        const stateChanges = (onStateChange.mock.calls[0] || []).length;
        const event = {
          ...new KeyboardEvent('keydown'),
          key: 'Enter',
        };
        inputProps.onKeyDown(event);

        expect(onStateChange).toHaveBeenCalledTimes(stateChanges);
      });

      test('is a noop with empty collections', () => {
        const onStateChange = jest.fn();
        const { inputProps } = createPlayground(createAutocomplete, {
          onStateChange,
          initialState: {
            isOpen: true,
            selectedItemId: 0,
            collections: [],
          },
        });

        const stateChanges = (onStateChange.mock.calls[0] || []).length;
        const event = {
          ...new KeyboardEvent('keydown'),
          key: 'Enter',
        };
        inputProps.onKeyDown(event);

        expect(onStateChange).toHaveBeenCalledTimes(stateChanges);
      });

      test('prevents the default event behavior', () => {
        const { inputProps } = createPlayground(createAutocomplete, {
          openOnFocus: true,
          initialState: {
            selectedItemId: 0,
            collections: [
              createCollection({
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        const event = {
          ...new KeyboardEvent('keydown'),
          key: 'Enter',
          preventDefault: jest.fn(),
        };

        inputProps.onKeyDown(event);

        expect(event.preventDefault).toHaveBeenCalledTimes(1);
      });

      describe('Plain Enter', () => {
        test('calls onSelect with item URL', () => {
          const onSelect = jest.fn();
          const navigator = {
            navigate: jest.fn(),
            navigateNewTab: jest.fn(),
            navigateNewWindow: jest.fn(),
          };
          const {
            inputElement,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setSelectedItemId,
            setStatus,
          } = createPlayground(createAutocomplete, {
            navigator,
            defaultSelectedItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect, getItemUrl: ({ item }) => item.url },
                  items: [
                    { label: '1', url: '#1' },
                    { label: '2', url: '#2' },
                  ],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{enter}');

          expect(onSelect).toHaveBeenCalledTimes(1);
          expect(onSelect).toHaveBeenCalledWith({
            event: expect.any(KeyboardEvent),
            item: {
              label: '1',
              url: '#1',
            },
            itemInputValue: '',
            itemUrl: '#1',
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setSelectedItemId,
            setStatus,
            source: expect.any(Object),
            state: {
              collections: [
                {
                  items: [
                    {
                      label: '1',
                      url: '#1',
                    },
                    {
                      label: '2',
                      url: '#2',
                    },
                  ],
                  source: expect.any(Object),
                },
              ],
              completion: null,
              context: {},
              isOpen: false,
              query: '',
              selectedItemId: 0,
              status: 'idle',
            },
          });
        });

        test('calls navigate with item URL', () => {
          const onSelect = jest.fn();
          const navigator = {
            navigate: jest.fn(),
            navigateNewTab: jest.fn(),
            navigateNewWindow: jest.fn(),
          };
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultSelectedItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect, getItemUrl: ({ item }) => item.url },
                  items: [
                    { label: '1', url: '#1' },
                    { label: '2', url: '#2' },
                  ],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{enter}');

          expect(navigator.navigate).toHaveBeenCalledTimes(1);
          expect(navigator.navigate).toHaveBeenCalledWith({
            item: { label: '1', url: '#1' },
            itemUrl: '#1',
            state: {
              collections: [
                {
                  items: [
                    { label: '1', url: '#1' },
                    { label: '2', url: '#2' },
                  ],
                  source: {
                    getItemInputValue: expect.any(Function),
                    getItemUrl: expect.any(Function),
                    getItems: expect.any(Function),
                    onHighlight: expect.any(Function),
                    onSelect,
                  },
                },
              ],
              completion: null,
              context: {},
              isOpen: false,
              query: '',
              selectedItemId: 0,
              status: 'idle',
            },
          });
        });

        test('calls onInput and onSelect without item URL', async () => {
          const onSelect = jest.fn();
          const onInput = jest.fn();
          const navigator = {
            navigate: jest.fn(),
            navigateNewTab: jest.fn(),
            navigateNewWindow: jest.fn(),
          };
          const {
            inputElement,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setSelectedItemId,
            setStatus,
          } = createPlayground(createAutocomplete, {
            onInput,
            navigator,
            defaultSelectedItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect },
                  items: [{ label: '1' }, { label: '2' }],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{enter}');

          expect(onInput).toHaveBeenCalledTimes(1);
          await runAllMicroTasks();
          expect(onSelect).toHaveBeenCalledTimes(1);
          expect(onSelect).toHaveBeenCalledWith({
            event: expect.any(KeyboardEvent),
            item: { label: '1' },
            itemInputValue: '',
            itemUrl: undefined,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setSelectedItemId,
            setStatus,
            source: expect.any(Object),
            state: {
              collections: [
                {
                  items: [{ label: '1' }, { label: '2' }],
                  source: expect.any(Object),
                },
              ],
              completion: null,
              context: {},
              isOpen: false,
              query: '',
              selectedItemId: 0,
              status: 'idle',
            },
          });
        });
      });

      describe('Meta+Enter / Ctrl+Enter', () => {
        test.todo('skips onSelect without item URL');

        test.todo('skips navigateNewTab without item URL');

        test.todo('calls onSelect with item URL');

        test.todo('calls navigateNewTab with item URL');
      });

      describe('Shift+Enter', () => {
        test.todo('skips onSelect without item URL');

        test.todo('skips navigateNewWindow without item URL');

        test.todo('calls onSelect with item URL');

        test.todo('calls navigateNewWindow with item URL');
      });

      describe('Alt+Enter', () => {
        test('triggers default browser behavior', () => {
          const onSelect = jest.fn();
          const navigator = {
            navigate: jest.fn(),
            navigateNewTab: jest.fn(),
            navigateNewWindow: jest.fn(),
          };
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultSelectedItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect },
                  items: [{ label: '1' }, { label: '2' }],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{alt}+{enter}');

          expect(onSelect).toHaveBeenCalledTimes(0);
          expect(navigator.navigate).toHaveBeenCalledTimes(0);
          expect(navigator.navigateNewTab).toHaveBeenCalledTimes(0);
          expect(navigator.navigateNewWindow).toHaveBeenCalledTimes(0);
        });
      });
    });
  });

  describe('onFocus', () => {});

  describe('onBlur', () => {});

  describe('onClick', () => {});
});
