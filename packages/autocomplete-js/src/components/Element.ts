import { setProperties } from '../utils';

type ElementProps = Record<string, unknown>;

export function Element<KParam extends keyof HTMLElementTagNameMap>(
  tagName: keyof HTMLElementTagNameMap | HTMLElement,
  props: ElementProps
): HTMLElementTagNameMap[KParam] {
  const element =
    typeof tagName === 'string'
      ? document.createElement<KParam>(tagName as any)
      : tagName;
  setProperties(element, props);

  return element as any;
}
