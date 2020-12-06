import { invariant } from '@algolia/autocomplete-shared';

export function getHTMLElement(value: string | HTMLElement): HTMLElement {
  if (typeof value === 'string') {
    const element = document.querySelector<HTMLElement>(value)!;

    invariant(
      element !== null,
      `The element ${JSON.stringify(value)} is not in the document.`
    );

    return element;
  }

  return value;
}
