import { Environment } from '@algolia/autocomplete-core';

export function getHTMLElement(
  value: string | HTMLElement,
  environment: Environment
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}
