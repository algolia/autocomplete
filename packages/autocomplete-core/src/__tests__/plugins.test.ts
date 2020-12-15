import { createPlayground } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

describe('plugins', () => {
  test.todo('notifies plugins when onSelect');

  test.todo('notifies plugins when onActive');

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
