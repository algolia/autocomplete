import userEvent from '@testing-library/user-event';

import {
  createSource,
  createPlayground,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';
import { BaseItem, AutocompleteOptions } from '../types';

describe('openOnFocus', () => {
  function setupTest<TItem extends BaseItem>(
    props: Partial<AutocompleteOptions<TItem>>
  ) {
    return createPlayground(createAutocomplete, {
      openOnFocus: true,
      defaultActiveItemId: 0,
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
    const { formElement } = setupTest({
      onStateChange,
      shouldPanelOpen: () => true,
    });

    formElement.reset();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          isOpen: true,
        }),
      })
    );
  });

  test('sets defaultActiveItemId on reset', () => {
    const onStateChange = jest.fn();
    const { formElement } = setupTest({
      onStateChange,
      defaultActiveItemId: 1,
    });

    formElement.reset();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 1,
        }),
      })
    );
  });

  test('triggers a search on focus without query', () => {
    const onStateChange = jest.fn();
    const { inputElement } = setupTest({ onStateChange });

    inputElement.focus();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          query: '',
        }),
      })
    );
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
    const { inputElement } = setupTest({
      onStateChange,
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

  test('does not open panel after getSources() without items', async () => {
    const onStateChange = jest.fn();
    const { inputElement } = setupTest({
      onStateChange,
      getSources() {
        return [];
      },
    });

    inputElement.focus();
    await runAllMicroTasks();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          isOpen: false,
        }),
      })
    );

    userEvent.type(inputElement, 'a{backspace}');
    await runAllMicroTasks();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          isOpen: false,
        }),
      })
    );
  });
});
