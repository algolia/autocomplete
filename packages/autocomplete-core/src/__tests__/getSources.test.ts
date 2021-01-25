import userEvent from '@testing-library/user-event';

import {
  createSource,
  createPlayground,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('getSources', () => {
  test('gets calls on input', () => {
    const getSources = jest.fn((..._args: any[]) => {
      return [createSource()];
    });
    const { inputElement } = createPlayground(createAutocomplete, {
      getSources,
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    expect(getSources).toHaveBeenCalledTimes(1);
    expect(getSources).toHaveBeenCalledWith({
      query: 'a',
      refresh: expect.any(Function),
      setCollections: expect.any(Function),
      setContext: expect.any(Function),
      setIsOpen: expect.any(Function),
      setQuery: expect.any(Function),
      setActiveItemId: expect.any(Function),
      setStatus: expect.any(Function),
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

  test('provides a default source implementations', async () => {
    const onStateChange = jest.fn();
    const getSources = () => {
      return [
        {
          getItems() {
            return [];
          },
          templates: {
            item() {},
          },
        },
      ];
    };
    const { inputElement } = createPlayground(createAutocomplete, {
      getSources,
      onStateChange,
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    await runAllMicroTasks();

    expect(onStateChange).toHaveBeenCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        collections: expect.arrayContaining([
          expect.objectContaining({
            source: expect.objectContaining({
              getItemInputValue: expect.any(Function),
              getItemUrl: expect.any(Function),
              getItems: expect.any(Function),
              onActive: expect.any(Function),
              onSelect: expect.any(Function),
              templates: expect.objectContaining({
                item: expect.any(Function),
              }),
            }),
          }),
        ]),
      }),
    });
  });

  test('concat getSources from plugins', async () => {
    const onStateChange = jest.fn();
    const getSources = () => {
      return [
        {
          getItems() {
            return [];
          },
          templates: {
            item() {},
          },
        },
      ];
    };
    const plugin = {
      getSources: () => {
        return [
          {
            getItems() {
              return [];
            },
            templates: {
              item() {},
            },
          },
        ];
      },
    };
    const { inputElement } = createPlayground(createAutocomplete, {
      onStateChange,
      getSources,
      plugins: [plugin],
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    await runAllMicroTasks();

    expect(onStateChange.mock.calls.pop()[0].state.collections).toEqual([
      expect.any(Object),
      expect.any(Object),
    ]);
  });
});
