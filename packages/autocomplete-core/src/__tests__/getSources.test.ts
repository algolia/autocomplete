import userEvent from '@testing-library/user-event';

import {
  createSource,
  createPlayground,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';
import * as handlers from '../onInput';

beforeEach(() => {
  document.body.innerHTML = '';
});

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
      navigator: expect.any(Object),
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
    const { inputElement } = createPlayground(createAutocomplete, {
      getSources: () => {
        return [
          {
            sourceId: 'testSource',
            getItems() {
              return [];
            },
            templates: {
              item() {},
            },
          },
        ];
      },
      onStateChange,
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    await runAllMicroTasks();

    expect(onStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          collections: expect.arrayContaining([
            expect.objectContaining({
              source: {
                getItemInputValue: expect.any(Function),
                getItemUrl: expect.any(Function),
                getItems: expect.any(Function),
                onActive: expect.any(Function),
                onSelect: expect.any(Function),
                onResolve: expect.any(Function),
                templates: expect.objectContaining({
                  item: expect.any(Function),
                }),
                sourceId: expect.any(String),
              },
            }),
          ]),
        }),
      })
    );
  });

  test('concat getSources from plugins', async () => {
    const onStateChange = jest.fn();
    const plugin = {
      getSources: () => {
        return [createSource({ sourceId: 'source1' })];
      },
    };
    const { inputElement } = createPlayground(createAutocomplete, {
      onStateChange,
      getSources: () => {
        return [createSource({ sourceId: 'source2' })];
      },
      plugins: [plugin],
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    await runAllMicroTasks();

    expect(onStateChange.mock.calls.pop()[0].state.collections).toHaveLength(2);
  });

  test('with circular references returned from getItems does not throw', () => {
    const { inputElement } = createPlayground(createAutocomplete, {
      getSources() {
        return [
          createSource({
            sourceId: 'source1',
            getItems: () => {
              const circular = { a: 'b', self: null };
              circular.self = circular;

              return [circular];
            },
          }),
        ];
      },
    });

    expect(() => {
      inputElement.focus();
      userEvent.type(inputElement, 'a');
    }).not.toThrow();
  });

  test('with nothing returned from getItems throws', async () => {
    const spy = jest.spyOn(handlers, 'onInput');

    const { inputElement } = createPlayground(createAutocomplete, {
      getSources() {
        return [
          createSource({
            sourceId: 'source1',
            // @ts-expect-error
            getItems: () => {},
          }),
        ];
      },
    });

    await expect(() => {
      inputElement.focus();
      userEvent.type(inputElement, 'a');

      return spy.mock.results[0].value;
    }).rejects.toThrow(
      '[Autocomplete] The `getItems` function from source "source1" must return an array of items but returned undefined.\n\nDid you forget to return items?\n\nSee: https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/#param-getitems'
    );

    spy.mockRestore();
  });
});
