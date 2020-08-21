export function getHTMLElement(value: string | HTMLElement): HTMLElement {
  if (typeof value === 'string') {
    return document.querySelector<HTMLElement>(value)!;
  }

  return value;
}
