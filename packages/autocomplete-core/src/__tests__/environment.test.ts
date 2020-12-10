import { createAutocomplete } from '../createAutocomplete';

describe('environment', () => {
  test('defaults to the global object', () => {
    jest.spyOn(global, 'setTimeout').mockImplementationOnce(jest.fn());
    const autocomplete = createAutocomplete({ openOnFocus: true });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    // `focus()` triggers `onInput` which calls `environment.setTimeout`
    inputElement.focus();

    expect(global.setTimeout).toHaveBeenCalledTimes(1);
  });

  test('allows providing a custom environment', () => {
    const environment = {
      ...global,
      setTimeout: jest.fn(),
    };
    const autocomplete = createAutocomplete({ environment, openOnFocus: true });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    // `focus()` triggers `onInput` which calls `environment.setTimeout`
    inputElement.focus();

    expect(environment.setTimeout).toHaveBeenCalledTimes(1);
  });

  test('does not throw without window', () => {
    delete global.window;

    expect(() => {
      createAutocomplete({});
    }).not.toThrow();
  });
});
