import { createSource, createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('openOnFocus', () => {
  function setupTest(props) {
    return createPlayground(createAutocomplete, {
      openOnFocus: true,
      defaultSelectedItemId: 0,
      ...props,
    });
  }

  test('triggers a search on reset', () => {
    const getSources = jest.fn(() => {
      return [createSource()];
    });
    const { formElement } = setupTest({ getSources });

    expect(getSources).toHaveBeenCalledTimes(0);
    formElement.reset();

    expect(getSources).toHaveBeenCalledTimes(1);
  });

  test('opens panel on reset', () => {
    const onStateChange = jest.fn();
    const { formElement } = setupTest({ onStateChange });

    formElement.reset();

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        isOpen: true,
      }),
    });
  });

  test('sets defaultSelectedItemId on reset', () => {
    const onStateChange = jest.fn();
    const { formElement } = setupTest({
      onStateChange,
      defaultSelectedItemId: 1,
    });

    formElement.reset();

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        selectedItemId: 1,
      }),
    });
  });

  test('triggers a search on focus without query', () => {
    const onStateChange = jest.fn();
    const { inputElement } = setupTest({ onStateChange });

    inputElement.focus();

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        query: '',
      }),
    });
  });

  test('calls getSources without query', () => {
    const getSources = jest.fn(() => {
      return [createSource()];
    });
    const { inputElement } = setupTest({ getSources });

    expect(getSources).toHaveBeenCalledTimes(0);
    inputElement.focus();

    expect(getSources).toHaveBeenCalledTimes(1);
  });

  test('opens panel without query', () => {
    const onStateChange = jest.fn();
    const { inputElement } = setupTest({ onStateChange });

    inputElement.focus();

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        isOpen: true,
      }),
    });
  });
});
