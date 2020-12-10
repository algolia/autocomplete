import {
  AutocompleteOptions,
  createAutocomplete as createAutocompleteCore,
} from '@algolia/autocomplete-core';

export function createPlayground<TItem extends Record<string, unknown>>(
  createAutocomplete: typeof createAutocompleteCore,
  props: AutocompleteOptions<TItem>
) {
  const autocomplete = createAutocomplete<TItem>(props);
  const inputElement = document.createElement('input');
  const formElement = document.createElement('form');
  const inputProps = autocomplete.getInputProps({ inputElement });
  const formProps = autocomplete.getFormProps({ inputElement });
  inputElement.addEventListener('blur', inputProps.onBlur);
  inputElement.addEventListener('input', inputProps.onChange);
  inputElement.addEventListener('click', inputProps.onClick);
  inputElement.addEventListener('focus', inputProps.onFocus);
  inputElement.addEventListener('keydown', inputProps.onKeyDown);
  formElement.addEventListener('reset', formProps.onReset);
  formElement.addEventListener('submit', formProps.onSubmit);
  formElement.appendChild(inputElement);
  document.body.appendChild(formElement);

  return {
    ...autocomplete,
    inputElement,
    formElement,
    inputProps,
    formProps,
  };
}
