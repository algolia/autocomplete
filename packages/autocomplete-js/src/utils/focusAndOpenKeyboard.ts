import { AutocompleteEnvironment } from '@algolia/autocomplete-core';

// Mobile devices don't open the keyboard when programmatically focusing inputs.
// See https://stackoverflow.com/a/55425845
export function focusAndOpenKeyboard(
  environment: AutocompleteEnvironment,
  inputElement: HTMLInputElement,
  timeout: number = 0
) {
  if (inputElement) {
    const tempInput = environment.document.createElement('input');
    const { top, left } = inputElement.getBoundingClientRect();

    tempInput.style.position = 'absolute';
    tempInput.style.top = `${top}px`;
    tempInput.style.left = `${left}px`;
    tempInput.style.height = '0';
    tempInput.style.opacity = '0';

    environment.document.body.appendChild(tempInput);
    tempInput.focus();

    setTimeout(() => {
      inputElement.focus();
      inputElement.click();

      environment.document.body.removeChild(tempInput);
    }, timeout);
  }
}
