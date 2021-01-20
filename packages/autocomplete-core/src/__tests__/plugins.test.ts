import userEvent from '@testing-library/user-event';

import {
  createCollection,
  createPlayground,
  createSource,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('plugins', () => {
  test('notifies plugins when onActive', async () => {
    const onActive = jest.fn();
    const plugin = { onActive };
    const { inputElement } = createPlayground(createAutocomplete, {
      defaultActiveItemId: 0,
      plugins: [plugin],
      getSources: () => {
        return [
          createSource({
            getItems() {
              return [{ label: '1' }, { label: '2' }];
            },
            onActive,
          }),
        ];
      },
    });

    userEvent.type(inputElement, 'a');

    await runAllMicroTasks();
    expect(onActive).toHaveBeenCalledTimes(1);
    expect(plugin.onActive).toHaveBeenCalledTimes(1);
  });

  test('notifies plugins when onSelect', async () => {
    const onSelect = jest.fn();
    const plugin = { onSelect };
    const { inputElement } = createPlayground(createAutocomplete, {
      defaultActiveItemId: 0,
      plugins: [plugin],
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

    await runAllMicroTasks();
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(plugin.onSelect).toHaveBeenCalledTimes(1);
  });

  test('notifies plugins when onStateChange', () => {
    const onStateChange = jest.fn();
    const plugin = { onStateChange: jest.fn() };
    const { setIsOpen } = createPlayground(createAutocomplete, {
      onStateChange,
      plugins: [plugin],
    });

    setIsOpen(true);

    expect(onStateChange).toHaveBeenCalledTimes(1);
    expect(plugin.onStateChange).toHaveBeenCalledTimes(1);
  });

  test('notifies plugins when onSubmit', () => {
    const onSubmit = jest.fn();
    const plugin = { onSubmit: jest.fn() };
    const { formElement } = createPlayground(createAutocomplete, {
      onSubmit,
      plugins: [plugin],
    });

    formElement.submit();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(plugin.onSubmit).toHaveBeenCalledTimes(1);
  });

  test('notifies plugins when onReset', () => {
    const onReset = jest.fn();
    const plugin = { onReset: jest.fn() };
    const { formElement } = createPlayground(createAutocomplete, {
      onReset,
      plugins: [plugin],
    });

    formElement.reset();

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(plugin.onReset).toHaveBeenCalledTimes(1);
  });
});
