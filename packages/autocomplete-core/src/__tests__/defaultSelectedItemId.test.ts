import userEvent from '@testing-library/user-event';

import { createAutocomplete } from '../createAutocomplete';

describe('defaultSelectedItemId', () => {
  test('selects unset defaultSelectedItemId on open (onInput)', () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      openOnFocus: true,
      onStateChange,
    });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('blur', inputProps.onBlur);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, 'a');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        selectedItemId: null,
      }),
    });
  });

  test('selects provided defaultSelectedItemId on open (onInput)', () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultSelectedItemId: 0,
    });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    inputElement.focus();

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        selectedItemId: 0,
      }),
    });
  });

  test('selects defaultSelectedItemId with openOnFocus on reset', () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultSelectedItemId: 0,
    });
    const formElement = document.createElement('form');
    const inputElement = document.createElement('input');
    const formProps = autocomplete.getFormProps({ inputElement });
    const inputProps = autocomplete.getInputProps({ inputElement });
    formElement.addEventListener('reset', formProps.onReset);
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(formElement);
    formElement.appendChild(inputElement);

    autocomplete.setSelectedItemId(null);
    formElement.reset();

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        selectedItemId: 0,
      }),
    });
  });

  test('selects defaultSelectedItemId on focus', () => {
    const onStateChange = jest.fn();
    const { getInputProps } = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultSelectedItemId: 0,
    });
    const inputElement = document.createElement('input');
    const inputProps = getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    inputElement.focus();

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        selectedItemId: 0,
      }),
    });
  });

  test('selects defaultSelectedItemId when ArrowDown on the last', () => {
    const onStateChange = jest.fn();
    const { getInputProps } = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultSelectedItemId: 0,
      initialState: {
        selectedItemId: 1,
      },
    });
    const inputElement = document.createElement('input');
    const inputProps = getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        selectedItemId: 0,
      }),
    });
  });

  test('selects defaultSelectedItemId when ArrowUp on the first', () => {
    const onStateChange = jest.fn();
    const { getInputProps } = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultSelectedItemId: 0,
      initialState: {
        selectedItemId: 1,
      },
    });
    const inputElement = document.createElement('input');
    const inputProps = getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, '{arrowup}');

    expect(onStateChange).toHaveBeenLastCalledWith({
      prevState: expect.anything(),
      state: expect.objectContaining({
        selectedItemId: 0,
      }),
    });
  });
});
