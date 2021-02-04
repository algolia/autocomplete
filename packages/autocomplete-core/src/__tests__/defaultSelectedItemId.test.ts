import userEvent from '@testing-library/user-event';

import { createAutocomplete } from '../createAutocomplete';

describe('defaultActiveItemId', () => {
  test('selects unset defaultActiveItemId on open (onInput)', () => {
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

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: null,
        }),
      })
    );
  });

  test('selects provided defaultActiveItemId on open (onInput)', () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultActiveItemId: 0,
    });
    const inputElement = document.createElement('input');
    const inputProps = autocomplete.getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    inputElement.focus();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 0,
        }),
      })
    );
  });

  test('selects defaultActiveItemId with openOnFocus on reset', () => {
    const onStateChange = jest.fn();
    const autocomplete = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultActiveItemId: 0,
    });
    const formElement = document.createElement('form');
    const inputElement = document.createElement('input');
    const formProps = autocomplete.getFormProps({ inputElement });
    const inputProps = autocomplete.getInputProps({ inputElement });
    formElement.addEventListener('reset', formProps.onReset);
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(formElement);
    formElement.appendChild(inputElement);

    autocomplete.setActiveItemId(null);
    formElement.reset();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 0,
        }),
      })
    );
  });

  test('selects defaultActiveItemId on focus', () => {
    const onStateChange = jest.fn();
    const { getInputProps } = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultActiveItemId: 0,
    });
    const inputElement = document.createElement('input');
    const inputProps = getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    document.body.appendChild(inputElement);

    inputElement.focus();

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 0,
        }),
      })
    );
  });

  test('selects defaultActiveItemId when ArrowDown on the last', () => {
    const onStateChange = jest.fn();
    const { getInputProps } = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultActiveItemId: 0,
      initialState: {
        activeItemId: 1,
      },
    });
    const inputElement = document.createElement('input');
    const inputProps = getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, '{arrowdown}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 0,
        }),
      })
    );
  });

  test('selects defaultActiveItemId when ArrowUp on the first', () => {
    const onStateChange = jest.fn();
    const { getInputProps } = createAutocomplete({
      openOnFocus: true,
      onStateChange,
      defaultActiveItemId: 0,
      initialState: {
        activeItemId: 1,
      },
    });
    const inputElement = document.createElement('input');
    const inputProps = getInputProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('input', inputProps.onChange);
    document.body.appendChild(inputElement);

    userEvent.type(inputElement, '{arrowup}');

    expect(onStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          activeItemId: 0,
        }),
      })
    );
  });
});
