import {
  AutocompleteApi,
  AutocompleteOptions,
  createAutocomplete as createAutocompleteCore,
} from '@algolia/autocomplete-core';

export function createPlayground<TItem extends Record<string, unknown>>(
  createAutocomplete: typeof createAutocompleteCore,
  props: AutocompleteOptions<TItem>
) {
  const inputElement = document.createElement('input');
  const resetElement = document.createElement('button');
  resetElement.type = 'reset';
  const formElement = document.createElement('form');
  let autocomplete: AutocompleteApi<TItem> | null = null;
  autocomplete = createAutocomplete<TItem>({
    ...props,
    onStateChange(p) {
      props.onStateChange?.(p);
      simplifiedRender();
    },
  });
  const inputProps = autocomplete.getInputProps({ inputElement });
  const formProps = autocomplete.getFormProps({ inputElement });
  inputElement.addEventListener('blur', inputProps.onBlur);
  inputElement.addEventListener('input', inputProps.onChange);
  inputElement.addEventListener('compositionend', inputProps.onCompositionEnd);
  inputElement.addEventListener('click', inputProps.onClick);
  inputElement.addEventListener('focus', inputProps.onFocus);
  inputElement.addEventListener('keydown', inputProps.onKeyDown);
  formElement.addEventListener('reset', formProps.onReset);
  formElement.addEventListener('submit', formProps.onSubmit);
  formElement.appendChild(inputElement);
  formElement.appendChild(resetElement);
  document.body.appendChild(formElement);

  function simplifiedRender() {
    // early exit if the autocomplete instance is not ready yet (eg. through plugins)
    if (!autocomplete) {
      return;
    }

    Object.entries(autocomplete.getInputProps({ inputElement })).forEach(
      ([key, value]) => {
        if (key.startsWith('on')) {
          return;
        }

        inputElement[key as any] = value;
      }
    );
  }

  return {
    ...autocomplete,
    inputElement,
    resetElement,
    formElement,
    inputProps,
    formProps,
  };
}
