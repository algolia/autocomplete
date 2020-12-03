import { createPlayground, createSource } from '../../../../test/utils';

describe('refresh', () => {
  function setupTest(props) {
    return createPlayground({
      openOnFocus: true,
      defaultSelectedItemId: 0,
      ...props,
    });
  }

  test('triggers a search with the current query', () => {
    const onStateChange = jest.fn();
    const getSources = jest.fn(() => {
      return [createSource()];
    });
    const { refresh, setQuery } = setupTest({ onStateChange, getSources });

    setQuery('a');
    expect(getSources).toHaveBeenCalledTimes(0);
    refresh();

    expect(getSources).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        query: 'a',
      }),
    });
  });

  test('leaves the next open state as provided', () => {
    const onStateChange = jest.fn();
    const getSources = jest.fn(() => {
      return [createSource()];
    });
    const { refresh, setIsOpen } = setupTest({
      onStateChange,
      getSources,
    });

    setIsOpen(true);
    expect(getSources).toHaveBeenCalledTimes(0);
    refresh();

    expect(getSources).toHaveBeenCalledTimes(1);
    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        isOpen: true,
      }),
    });
  });
});
