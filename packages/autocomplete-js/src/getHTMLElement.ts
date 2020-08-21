import { AutocompleteOptions } from '@francoischalifour/autocomplete-core';

export function getHTMLElement(
  value: string | HTMLElement,
  environment: AutocompleteOptions<any>['environment']
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}
