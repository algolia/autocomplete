import { createSource } from '../../../../test/utils';
import { createAutocomplete } from '../createAutocomplete';

type AutocompleteItem = { url: string };

describe('openOnFocus', () => {
  function setupTest(props) {
    const autocomplete = createAutocomplete<AutocompleteItem>({
      openOnFocus: true,
      defaultSelectedItemId: 0,
      ...props,
    });
    const inputElement = document.createElement('input');
    const formElement = document.createElement('form');
    const inputProps = autocomplete.getInputProps({ inputElement });
    const formProps = autocomplete.getFormProps({ inputElement });
    inputElement.addEventListener('focus', inputProps.onFocus);
    inputElement.addEventListener('blur', inputProps.onBlur);
    inputElement.addEventListener('input', inputProps.onChange);
    inputElement.addEventListener('keydown', inputProps.onKeyDown);
    formElement.addEventListener('reset', formProps.onReset);
    formElement.addEventListener('submit', formProps.onSubmit);
    formElement.appendChild(inputElement);
    document.body.appendChild(formElement);

    return {
      inputElement,
      formElement,
    };
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
