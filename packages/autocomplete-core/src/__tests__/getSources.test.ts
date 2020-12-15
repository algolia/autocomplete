import userEvent from '@testing-library/user-event';

import { createSource, createPlayground } from '../../../../test/utils';
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

  test.todo('provides default source implementations');

  test.todo('concat getSources from plugins');
});
