import { setProperties } from '../utils';

type ElementProps = Record<string, unknown> & {
  children?: Node[];
};

export function Element<KParam extends keyof HTMLElementTagNameMap>(
  tagName: keyof HTMLElementTagNameMap | HTMLElement,
  { children = [], ...props }: ElementProps
): HTMLElementTagNameMap[KParam] {
  const element =
    typeof tagName === 'string'
      ? document.createElement<KParam>(tagName as any)
      : tagName;
  setProperties(element, props);

  element.append(...children);

  return element as any;
}
