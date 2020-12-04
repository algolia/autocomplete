import userEvent from '@testing-library/user-event';

import {
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

    test('calls getSources', async () => {
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

      expect(environment.clearTimeout).toHaveBeenCalledTimes(1);
      expect(environment.clearTimeout).toHaveBeenCalledWith(999);
    });
  });

  describe('onKeyDown', () => {});

  describe('onFocus', () => {});

  describe('onBlur', () => {});

  describe('onClick', () => {});
});
