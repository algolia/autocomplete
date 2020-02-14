import { Environment } from '../autocomplete-core/types';

export function getHTMLElement(
  value: string | HTMLElement,
  environment: Environment
): HTMLElement {
  if (typeof value === 'string') {
    return environment.document.querySelector<HTMLElement>(value)!;
  }

  return value;
}
