import { setProperties } from './utils';

type CreateDomElementProps = Record<string, unknown> & {
  children?: Node[];
};

export function createDomElement<KParam extends keyof HTMLElementTagNameMap>(
  tagName: KParam,
  { children = [], ...props }: CreateDomElementProps
): HTMLElementTagNameMap[KParam] {
  const element = document.createElement<KParam>(tagName);
  setProperties(element, props);
  element.append(...children);

  return element;
}
