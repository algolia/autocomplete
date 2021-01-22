import { fireEvent } from '@testing-library/dom';
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
      openOnFocus: true,
    });

    fireEvent.input(inputElement, { target: { value: 'a' } });

    await runAllMicroTasks();

    onStateChange.mock.calls.forEach((x) =>
      x[0].state.collections.forEach((collection: any) => {
        expect(collection.source.getItemInputValue).not.toBe(undefined);
        expect(collection.source.getItemUrl).not.toBe(undefined);
        expect(collection.source.getItems).not.toBe(undefined);
        expect(collection.source.onActive).not.toBe(undefined);
        expect(collection.source.onSelect).not.toBe(undefined);
        expect(collection.source.templates).not.toBe(undefined);
        expect(collection.source.templates.item).not.toBe(undefined);
      })
    );
  });

  test.todo('concat getSources from plugins');
});
