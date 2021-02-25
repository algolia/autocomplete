import { createAutocomplete } from '../createAutocomplete';

describe('debug', () => {
  test('warns about development usage', () => {
    expect(() => {
      createAutocomplete({ debug: true });
    }).toWarnDev(
      '[Autocomplete] The `debug` option is meant for development debugging and should not be used in production.'
    );
  });

  test('keeps the panel open on blur', () => {
    const onStateChange = jest.fn();
    const { getInputProps } = createAutocomplete({
      debug: true,
      openOnFocus: true,
      shouldPanelOpen: () => true,
      onStateChange,
    });
    const inputElement = document.createElement('input');
    const inputProps = getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('blur', inputProps.onBlur);
    document.body.appendChild(inputElement);

    inputElement.focus();
    inputElement.blur();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({ isOpen: true }),
      })
    );
  });
});
