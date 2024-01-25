import { fireEvent, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  createCollection,
  createNavigator,
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

  test('returns undefined aria-activedescendant when panel is open and but no active item', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        initialState: {
          isOpen: true,
          activeItemId: null,
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
          activeItemId: 0,
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
      {
        id: 'autocomplete',
        initialState: {
          isOpen: true,
          collections: [
            createCollection({
              source: { sourceId: 'testSource' },
            }),
          ],
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps['aria-controls']).toEqual('autocomplete-testSource-list');
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

  test('returns enterKeyHint "search" without item URL', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        defaultActiveItemId: 0,
        initialState: {
          collections: [
            createCollection({
              items: [{ label: '1' }, { label: '2' }],
            }),
          ],
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.enterKeyHint).toEqual('search');
  });

  test('returns enterKeyHint "go" with item URL', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        defaultActiveItemId: 0,
        initialState: {
          collections: [
            createCollection({
              source: { getItemUrl: ({ item }) => item.url },
              items: [
                { label: '1', url: '#1' },
                { label: '2', url: '#2' },
              ],
            }),
          ],
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.enterKeyHint).toEqual('go');
  });

  test('returns enterKeyHint "enter" when explicitly defined', () => {
    const { getInputProps, inputElement } = createPlayground(
      createAutocomplete,
      {
        enterKeyHint: 'enter',
        defaultActiveItemId: 0,
        initialState: {
          collections: [
            createCollection({
              source: { getItemUrl: ({ item }) => item.url },
              items: [
                { label: '1', url: '#1' },
                { label: '2', url: '#2' },
              ],
            }),
          ],
        },
      }
    );
    const inputProps = getInputProps({ inputElement });

    expect(inputProps.enterKeyHint).toEqual('enter');
  });

  describe('onChange', () => {
    test('sets the query', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
      });

      userEvent.type(inputElement, 'a');

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            query: 'a',
          }),
        })
      );
    });

    test('sets activeItemId to defaultActiveItemId', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
        defaultActiveItemId: 0,
      });

      userEvent.type(inputElement, 'a');

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            activeItemId: 0,
          }),
        })
      );
    });

    test('resets the state without query', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
      });

      userEvent.type(inputElement, '');

      expect(onStateChange).not.toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            status: 'loading',
          }),
        })
      );
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            status: 'idle',
            collections: [],
            isOpen: false,
          }),
        })
      );
    });

    test('sets the status to loading before fetching sources', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
      });

      userEvent.type(inputElement, 'a');

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            status: 'loading',
          }),
        })
      );
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
        navigator,
        refresh,
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setActiveItemId,
        setStatus,
      } = createPlayground(createAutocomplete, {
        onStateChange,
        getSources,
      });

      userEvent.type(inputElement, 'a');

      expect(getSources).toHaveBeenCalledWith({
        query: 'a',
        navigator,
        refresh,
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setActiveItemId,
        setStatus,
        state: {
          collections: [],
          completion: null,
          context: {},
          isOpen: false,
          query: 'a',
          activeItemId: null,
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

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
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
        })
      );
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

      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
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
        })
      );
    });

    test('calls onActive', async () => {
      const onStateChange = jest.fn();
      const onActive = jest.fn();
      const getSources = jest.fn((..._args: any[]) => {
        return [
          createSource({
            getItems() {
              return [{ label: '1' }, { label: '2' }];
            },
            onActive,
          }),
        ];
      });
      const {
        inputElement,
        navigator,
        refresh,
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setActiveItemId,
        setStatus,
      } = createPlayground(createAutocomplete, {
        defaultActiveItemId: 0,
        onStateChange,
        getSources,
      });

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      expect(onActive).toHaveBeenCalledTimes(1);
      expect(onActive).toHaveBeenCalledWith({
        event: expect.any(Event),
        item: { label: '1', __autocomplete_id: 0 },
        itemInputValue: 'a',
        itemUrl: undefined,
        navigator,
        refresh,
        source: expect.any(Object),
        setCollections,
        setContext,
        setIsOpen,
        setQuery,
        setActiveItemId,
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
          activeItemId: 0,
          status: 'idle',
        },
      });
    });

    test('lets user handle the errors', async () => {
      const onError = jest.fn();

      const { inputElement } = createPlayground(createAutocomplete, {
        getSources: jest.fn(() => {
          return [
            createSource({
              getItems() {
                return new Promise<any>((_, reject) => {
                  reject(new Error('Fetch error'));
                }).catch((err) => {
                  onError(err);

                  return [];
                });
              },
            }),
          ];
        }),
      });

      userEvent.type(inputElement, 'a');

      await runAllMicroTasks();

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(new Error('Fetch error'));
    });

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

    test('stops process if IME composition is in progress and `ignoreCompositionEvents: true`', () => {
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
        ignoreCompositionEvents: true,
        getSources,
      });

      // Typing 木 using the Wubihua input method
      // see:
      // - https://en.wikipedia.org/wiki/Stroke_count_method
      // - https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event
      const character = '木';
      const strokes = ['一', '丨', '丿', '丶', character];

      strokes.forEach((stroke, index) => {
        const isFirst = index === 0;
        const isLast = index === strokes.length - 1;
        const query = isLast ? stroke : strokes.slice(0, index + 1).join('');

        if (isFirst) {
          fireEvent.compositionStart(inputElement);
        }

        fireEvent.compositionUpdate(inputElement, {
          data: query,
        });

        fireEvent.input(inputElement, {
          isComposing: true,
          target: {
            value: query,
          },
        });

        if (isLast) {
          fireEvent.compositionEnd(inputElement, {
            data: query,
            target: {
              value: query,
            },
          });
        }
      });

      expect(inputElement).toHaveValue(character);
      expect(getSources).toHaveBeenCalledTimes(1);
      expect(getSources).toHaveBeenLastCalledWith(
        expect.objectContaining({
          query: character,
        })
      );
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
                source: { sourceId: 'testSource' },
                items: [{ label: '1' }],
              }),
            ],
          },
          ...props,
        });
        const item = document.createElement('div');
        item.setAttribute('id', 'autocomplete-testSource-item-0');
        document.body.appendChild(item);

        return { ...playground, item };
      }

      test('scrolls to the active item with scrollIntoViewIfNeeded fallback with ArrowDown', () => {
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

      test('scrolls to the active item with scrollIntoViewIfNeeded fallback with ArrowUp', () => {
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

      test('scrolls to the active item with scrollIntoView fallback with ArrowDown', () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({ onStateChange });
        item.scrollIntoView = jest.fn();

        inputElement.focus();
        userEvent.type(inputElement, '{arrowdown}');

        expect(item.scrollIntoView).toHaveBeenCalledTimes(1);
        expect(item.scrollIntoView).toHaveBeenCalledWith(false);
      });

      test('scrolls to the active item with scrollIntoView fallback with ArrowUp', () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({ onStateChange });
        item.scrollIntoView = jest.fn();

        inputElement.focus();
        userEvent.type(inputElement, '{arrowup}');

        expect(item.scrollIntoView).toHaveBeenCalledTimes(1);
        expect(item.scrollIntoView).toHaveBeenCalledWith(false);
      });

      test('calls onActive when activeItemId', () => {
        const onStateChange = jest.fn();
        const onActive = jest.fn();
        const {
          inputElement,
          navigator,
          refresh,
          setCollections,
          setContext,
          setIsOpen,
          setQuery,
          setActiveItemId,
          setStatus,
        } = createPlayground(createAutocomplete, {
          openOnFocus: true,
          onStateChange,
          initialState: {
            collections: [
              createCollection({
                source: { onActive },
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        inputElement.focus();
        userEvent.type(inputElement, 'a{arrowdown}');

        expect(onActive).toHaveBeenCalledTimes(1);
        expect(onActive).toHaveBeenCalledWith({
          event: expect.any(Event),
          item: { label: '1' },
          itemInputValue: 'a',
          itemUrl: undefined,
          source: expect.any(Object),
          navigator,
          refresh,
          setCollections,
          setContext,
          setIsOpen,
          setQuery,
          setActiveItemId,
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
            activeItemId: 0,
            status: 'loading',
          },
        });
      });

      test('does not call onActive when no activeItemId', () => {
        const onStateChange = jest.fn();
        const onActive = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          openOnFocus: true,
          onStateChange,
          initialState: {
            collections: [
              createCollection({
                source: { onActive },
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        inputElement.focus();
        expect(onActive).toHaveBeenCalledTimes(0);

        userEvent.type(inputElement, '{arrowdown}');
        expect(onActive).toHaveBeenCalledTimes(1);

        userEvent.type(inputElement, '{arrowup}');
        expect(onActive).toHaveBeenCalledTimes(1);
      });

      test('ArrowDown opens the panel when closed with openOnFocus and selects defaultActiveItemId', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          getSources() {
            return [
              createSource({
                getItems() {
                  return [{ label: '1' }];
                },
              }),
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();

        userEvent.type(inputElement, '{esc}{arrowdown}');
        await runAllMicroTasks();

        await waitFor(() => {
          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
                activeItemId: null,
              }),
            })
          );
        });
      });

      test('ArrowDown opens the panel when closed with a query and selects defaultActiveItemId', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          initialState: {
            query: 'a',
          },
          getSources() {
            return [
              createSource({
                getItems() {
                  return [{ label: '1' }];
                },
              }),
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();

        userEvent.type(inputElement, '{esc}{arrowdown}');
        await runAllMicroTasks();

        await waitFor(() => {
          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
                activeItemId: null,
              }),
            })
          );
        });
      });

      test('ArrowDown opens the panel when closed with openOnFocus and selects defaultActiveItemId with scrollIntoView', async () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({
          onStateChange,
          defaultActiveItemId: 0,
          getSources() {
            return [
              createSource({
                getItems() {
                  return [{ label: '1' }];
                },
              }),
            ];
          },
        });
        item.scrollIntoView = jest.fn();

        inputElement.focus();
        await runAllMicroTasks();

        userEvent.type(inputElement, '{esc}{arrowdown}');
        await runAllMicroTasks();

        await waitFor(() => {
          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
                activeItemId: 0,
              }),
            })
          );

          expect(item.scrollIntoView).toHaveBeenCalledTimes(1);
          expect(item.scrollIntoView).toHaveBeenCalledWith(false);
        });
      });

      test('ArrowUp opens the panel when closed with openOnFocus and selects the last item', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          getSources() {
            return [
              createSource({
                getItems() {
                  return [{ label: '1' }];
                },
              }),
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();

        userEvent.type(inputElement, '{esc}{arrowup}');
        await runAllMicroTasks();

        await waitFor(() => {
          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
                activeItemId: 0,
              }),
            })
          );
        });
      });

      test('ArrowUp opens the panel when closed with a query and selects the last item', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          initialState: {
            query: 'a',
          },
          getSources() {
            return [
              createSource({
                getItems() {
                  return [{ label: '1' }];
                },
              }),
            ];
          },
        });

        inputElement.focus();
        await runAllMicroTasks();

        userEvent.type(inputElement, '{esc}{arrowup}');
        await runAllMicroTasks();

        await waitFor(() => {
          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
                activeItemId: 0,
              }),
            })
          );
        });
      });

      test('ArrowUp opens the panel when closed with openOnFocus and selects the last item with scrollIntoView', async () => {
        const onStateChange = jest.fn();
        const { inputElement, item } = setupTestWithItem({
          onStateChange,
          getSources() {
            return [
              createSource({
                getItems() {
                  return [{ label: '1' }];
                },
              }),
            ];
          },
        });
        item.scrollIntoView = jest.fn();

        inputElement.focus();
        await runAllMicroTasks();

        userEvent.type(inputElement, '{esc}{arrowup}');
        await runAllMicroTasks();

        await waitFor(() => {
          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
                activeItemId: 0,
              }),
            })
          );

          expect(item.scrollIntoView).toHaveBeenCalledTimes(1);
          expect(item.scrollIntoView).toHaveBeenCalledWith(false);
        });
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
            isOpen: true,
            collections: [
              createCollection({
                items: [{ label: '1' }, { label: '2' }],
              }),
            ],
          },
        });

        userEvent.type(inputElement, '{esc}');

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: false,
              completion: null,
            }),
          })
        );
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

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              query: '',
              status: 'idle',
              activeItemId: null,
              collections: [],
            }),
          })
        );
      });
    });

    describe('Enter', () => {
      test('is a noop without activeItemId', () => {
        const onStateChange = jest.fn();
        const { inputProps } = createPlayground(createAutocomplete, {
          onStateChange,
          initialState: {
            isOpen: true,
            activeItemId: null,
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
            activeItemId: 0,
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
            activeItemId: 0,
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

      test('closes the panel when no item was selected', async () => {
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

        userEvent.type(inputElement, '{enter}');

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({ isOpen: false }),
          })
        );
      });

      describe('Plain Enter', () => {
        test('calls onSelect with item URL', () => {
          const onSelect = jest.fn();
          const {
            inputElement,
            navigator,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
            setStatus,
          } = createPlayground(createAutocomplete, {
            navigator: createNavigator(),
            defaultActiveItemId: 0,
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
            navigator,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
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
              activeItemId: 0,
              status: 'idle',
            },
          });
        });

        test('calls navigate with item URL', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
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
                    sourceId: expect.any(String),
                    getItemInputValue: expect.any(Function),
                    getItemUrl: expect.any(Function),
                    getItems: expect.any(Function),
                    onActive: expect.any(Function),
                    onResolve: expect.any(Function),
                    onSelect,
                  },
                },
              ],
              completion: null,
              context: {},
              isOpen: false,
              query: '',
              activeItemId: 0,
              status: 'idle',
            },
          });
        });

        test('calls getSources and onSelect without item URL', async () => {
          const onSelect = jest.fn();
          const getSources = jest.fn(() => [
            createSource({
              onSelect,
              getItems: () => [{ label: '1' }, { label: '2' }],
            }),
          ]);
          const {
            inputElement,
            navigator,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
            setStatus,
          } = createPlayground(createAutocomplete, {
            navigator: createNavigator(),
            defaultActiveItemId: 0,
            getSources,
          });

          inputElement.focus();
          userEvent.type(inputElement, 'a');
          await runAllMicroTasks();

          expect(getSources).toHaveBeenCalledTimes(1);

          userEvent.type(inputElement, '{enter}');
          await runAllMicroTasks();

          expect(getSources).toHaveBeenCalledTimes(2);
          expect(onSelect).toHaveBeenCalledTimes(1);
          expect(onSelect).toHaveBeenCalledWith({
            event: expect.any(KeyboardEvent),
            item: expect.objectContaining({ label: '1' }),
            itemInputValue: 'a',
            itemUrl: undefined,
            navigator,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
            setStatus,
            source: expect.any(Object),
            state: {
              collections: [
                {
                  items: [
                    expect.objectContaining({ label: '1' }),
                    expect.objectContaining({ label: '2' }),
                  ],
                  source: expect.any(Object),
                },
              ],
              completion: null,
              context: {},
              isOpen: false,
              query: 'a',
              activeItemId: 0,
              status: 'idle',
            },
          });
        });
      });

      describe('Meta+Enter / Ctrl+Enter', () => {
        test('skips onSelect without item URL', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect },
                  items: [
                    { label: '1', url: '#1' },
                    { label: '2', url: '#2' },
                  ],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{ctrl}{enter}');

          expect(onSelect).toHaveBeenCalledTimes(0);
        });

        test('skips navigateNewTab without item URL', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect },
                  items: [
                    { label: '1', url: '#1' },
                    { label: '2', url: '#2' },
                  ],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{ctrl}{enter}');

          expect(navigator.navigateNewTab).toHaveBeenCalledTimes(0);
        });

        test('calls onSelect with item URL', () => {
          const onSelect = jest.fn();
          const {
            inputElement,
            navigator,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
            setStatus,
          } = createPlayground(createAutocomplete, {
            navigator: createNavigator(),
            defaultActiveItemId: 0,
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
          userEvent.type(inputElement, '{ctrl}{enter}');

          expect(onSelect).toHaveBeenCalledTimes(1);
          expect(onSelect).toHaveBeenCalledWith({
            event: expect.any(KeyboardEvent),
            item: {
              label: '1',
              url: '#1',
            },
            itemInputValue: '',
            itemUrl: '#1',
            navigator,
            refresh,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
            setStatus,
            source: expect.any(Object),
            state: expect.any(Object),
          });
        });

        test('calls navigateNewTab with item URL', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
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
          userEvent.type(inputElement, '{ctrl}{enter}');

          expect(navigator.navigateNewTab).toHaveBeenCalledTimes(1);
          expect(navigator.navigateNewTab).toHaveBeenCalledWith({
            item: {
              label: '1',
              url: '#1',
            },
            itemUrl: '#1',
            state: expect.any(Object),
          });
        });
      });

      describe('Shift+Enter', () => {
        test('skips onSelect without item URL', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect },
                  items: [
                    { label: '1', url: '#1' },
                    { label: '2', url: '#2' },
                  ],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{shift}{enter}');

          expect(onSelect).toHaveBeenCalledTimes(0);
        });

        test('skips navigateNewWindow without item URL', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
            initialState: {
              isOpen: true,
              collections: [
                createCollection({
                  source: { onSelect },
                  items: [
                    { label: '1', url: '#1' },
                    { label: '2', url: '#2' },
                  ],
                }),
              ],
            },
          });

          inputElement.focus();
          userEvent.type(inputElement, '{shift}{enter}');

          expect(navigator.navigateNewWindow).toHaveBeenCalledTimes(0);
        });

        test('calls onSelect with item URL', () => {
          const onSelect = jest.fn();
          const {
            inputElement,
            refresh,
            navigator,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
            setStatus,
          } = createPlayground(createAutocomplete, {
            navigator: createNavigator(),
            defaultActiveItemId: 0,
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
          userEvent.type(inputElement, '{shift}{enter}');

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
            navigator,
            setCollections,
            setContext,
            setIsOpen,
            setQuery,
            setActiveItemId,
            setStatus,
            source: expect.any(Object),
            state: expect.any(Object),
          });
        });

        test('calls navigateNewWindow with item URL', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
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
          userEvent.type(inputElement, '{shift}{enter}');

          expect(navigator.navigateNewWindow).toHaveBeenCalledTimes(1);
          expect(navigator.navigateNewWindow).toHaveBeenCalledWith({
            item: {
              label: '1',
              url: '#1',
            },
            itemUrl: '#1',
            state: expect.any(Object),
          });
        });
      });

      describe('Alt+Enter', () => {
        test('triggers default browser behavior', () => {
          const onSelect = jest.fn();
          const navigator = createNavigator();
          const { inputElement } = createPlayground(createAutocomplete, {
            navigator,
            defaultActiveItemId: 0,
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

    describe('Tab', () => {
      test('closes the panel and resets `activeItemId`', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          defaultActiveItemId: 1,
          getSources() {
            return [
              createSource({
                getItems: () => [{ label: '1' }],
              }),
            ];
          },
        });

        userEvent.click(inputElement);

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              activeItemId: 1,
            }),
          })
        );

        userEvent.tab();

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: false,
              activeItemId: null,
            }),
          })
        );
      });

      test('does not close closes the panel nor reset `activeItemId` in debug mode', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          debug: true,
          openOnFocus: true,
          defaultActiveItemId: 1,
          getSources() {
            return [
              createSource({
                getItems: () => [{ label: '1' }],
              }),
            ];
          },
        });

        userEvent.click(inputElement);

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              activeItemId: 1,
            }),
          })
        );

        userEvent.tab();

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              activeItemId: 1,
            }),
          })
        );
      });
    });

    describe('Tab+Shift', () => {
      test('closes the panel and resets `activeItemId`', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          defaultActiveItemId: 1,
          getSources() {
            return [
              createSource({
                getItems: () => [{ label: '1' }],
              }),
            ];
          },
        });

        userEvent.click(inputElement);

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              activeItemId: 1,
            }),
          })
        );

        userEvent.tab({ shift: true });

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: false,
              activeItemId: null,
            }),
          })
        );
      });

      test('does not close closes the panel nor reset `activeItemId` in debug mode', async () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          debug: true,
          openOnFocus: true,
          defaultActiveItemId: 1,
          getSources() {
            return [
              createSource({
                getItems: () => [{ label: '1' }],
              }),
            ];
          },
        });

        userEvent.click(inputElement);

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              activeItemId: 1,
            }),
          })
        );

        userEvent.tab({ shift: true });

        await runAllMicroTasks();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
              activeItemId: 1,
            }),
          })
        );
      });
    });

    test('stops process if IME composition is in progress`', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        openOnFocus: true,
        onStateChange,
        initialState: {
          collections: [
            createCollection({
              source: { sourceId: 'testSource' },
              items: [
                { label: '1' },
                { label: '2' },
                { label: '3' },
                { label: '4' },
              ],
            }),
          ],
        },
      });

      inputElement.focus();

      // 1. Pressing Arrow Down to select the first item
      fireEvent.keyDown(inputElement, { key: 'ArrowDown' });
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            activeItemId: 0,
          }),
        })
      );

      // 2. Typing かくてい with a Japanese IME
      const strokes = ['か', 'く', 'て', 'い'];
      strokes.forEach((_stroke, index) => {
        const isFirst = index === 0;
        const query = strokes.slice(0, index + 1).join('');

        if (isFirst) {
          fireEvent.compositionStart(inputElement);
        }

        fireEvent.compositionUpdate(inputElement, {
          data: query,
        });

        fireEvent.input(inputElement, {
          isComposing: true,
          data: query,
          target: {
            value: query,
          },
        });
      });

      // 3. Checking that activeItemId has reverted to null due to input change
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            activeItemId: null,
          }),
        })
      );

      // 4. Selecting the 3rd suggestion on the IME window
      fireEvent.keyDown(inputElement, { key: 'ArrowDown', isComposing: true });
      fireEvent.keyDown(inputElement, { key: 'ArrowDown', isComposing: true });
      fireEvent.keyDown(inputElement, { key: 'ArrowDown', isComposing: true });

      // 5. Checking that activeItemId has not changed
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            activeItemId: null,
          }),
        })
      );
    });
  });

  describe('onFocus', () => {
    test('triggers a query if `openOnFocus` is true', () => {
      const getSources = jest.fn(() => [createSource()]);
      const { inputElement } = createPlayground(createAutocomplete, {
        openOnFocus: true,
        getSources,
      });

      inputElement.focus();

      expect(getSources).toHaveBeenCalledTimes(1);
    });

    test('triggers a query if the current query is not empty', () => {
      const getSources = jest.fn(() => [createSource()]);
      const { inputElement } = createPlayground(createAutocomplete, {
        getSources,
        initialState: {
          query: 'i',
        },
      });

      inputElement.focus();

      expect(getSources).toHaveBeenCalledTimes(1);
    });

    describe('set activeItemId', () => {
      test('to null when there is no defaultActiveItemId', () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
        });

        inputElement.focus();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              activeItemId: null,
            }),
          })
        );
      });

      test('to defaultActiveItemId value when set', () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          defaultActiveItemId: 0,
        });

        inputElement.focus();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              activeItemId: 0,
            }),
          })
        );
      });
    });

    describe('set isOpen', () => {
      describe('shouldPanelOpen returns false', () => {
        test('to false when openOnFocus is false and the query empty', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
          });

          inputElement.focus();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: false,
              }),
            })
          );
        });

        test('to true when the query is set', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            initialState: {
              query: 'i',
            },
          });

          inputElement.focus();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: false,
              }),
            })
          );
        });

        test('to true when openOnFocus is true', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            openOnFocus: true,
          });

          inputElement.focus();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: false,
              }),
            })
          );
        });

        test('to true when openOnFocus is true and the query is set', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            openOnFocus: true,
            initialState: {
              query: 'i',
            },
          });

          inputElement.focus();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: false,
              }),
            })
          );
        });
      });

      describe('shouldPanelOpen returns true', () => {
        test('to false when openOnFocus is false and the query empty', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            shouldPanelOpen: () => true,
          });

          inputElement.focus();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: false,
              }),
            })
          );
        });

        test('to true when the query is set', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            shouldPanelOpen: () => true,
            initialState: {
              query: 'i',
            },
          });

          inputElement.focus();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
              }),
            })
          );
        });

        test('to true when openOnFocus is true', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            openOnFocus: true,
            shouldPanelOpen: () => true,
          });

          inputElement.focus();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
              }),
            })
          );
        });

        test('to true when openOnFocus is true and the query is set', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            openOnFocus: true,
            shouldPanelOpen: () => true,
            initialState: {
              query: 'i',
            },
          });

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
    });
  });

  describe('onClick', () => {
    test('is a noop when the input is not focused', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
      });

      inputElement.click();

      expect(onStateChange).toHaveBeenCalledTimes(0);
    });

    test('is a noop when panel is already open', () => {
      const onStateChange = jest.fn();
      const { inputElement } = createPlayground(createAutocomplete, {
        onStateChange,
        openOnFocus: true,
        shouldPanelOpen: () => true,
        initialState: {
          isOpen: true,
        },
      });

      inputElement.focus();

      // Clear mock information set by the `focus` event
      onStateChange.mockClear();

      inputElement.click();

      expect(onStateChange).toHaveBeenCalledTimes(0);
    });

    describe('when the input is focused and the panel closed', () => {
      describe('sets activeItemId', () => {
        test('to null when there is no defaultActiveItemId', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
          });

          inputElement.focus();

          // Closes the panel while keeping the input focused
          userEvent.type(inputElement, '{esc}');

          inputElement.click();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                activeItemId: null,
              }),
            })
          );
        });

        test('to defaultActiveItemId value when set', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            defaultActiveItemId: 1,
          });

          inputElement.focus();

          // Closes the panel while keeping the input focused
          userEvent.type(inputElement, '{esc}');

          inputElement.click();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                activeItemId: 1,
              }),
            })
          );
        });
      });

      describe('sets isOpen', () => {
        test('to false when openOnFocus is false and the query empty', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
          });

          inputElement.focus();

          // Closes the panel while keeping the input focused
          userEvent.type(inputElement, '{esc}');

          inputElement.click();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: false,
              }),
            })
          );
        });

        test('to true when the query is set', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            shouldPanelOpen: () => true,
            initialState: {
              query: 'i',
            },
          });

          inputElement.focus();

          // Closes the panel while keeping the input focused
          userEvent.type(inputElement, '{esc}');

          inputElement.click();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
              }),
            })
          );
        });

        test('to true when openOnFocus is true', () => {
          const onStateChange = jest.fn();
          const { inputElement } = createPlayground(createAutocomplete, {
            onStateChange,
            openOnFocus: true,
            shouldPanelOpen: () => true,
          });

          inputElement.focus();

          // Closes the panel while keeping the input focused
          userEvent.type(inputElement, '{esc}');

          inputElement.click();

          expect(onStateChange).toHaveBeenLastCalledWith(
            expect.objectContaining({
              state: expect.objectContaining({
                isOpen: true,
              }),
            })
          );
        });
      });

      test('to true when openOnFocus is true and the query is set', () => {
        const onStateChange = jest.fn();
        const { inputElement } = createPlayground(createAutocomplete, {
          onStateChange,
          openOnFocus: true,
          shouldPanelOpen: () => true,
        });

        inputElement.focus();

        // Closes the panel while keeping the input focused
        userEvent.type(inputElement, '{esc}');

        inputElement.click();

        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({
              isOpen: true,
            }),
          })
        );
      });
    });
  });
});
