import { AutocompleteEnvironment } from '@algolia/autocomplete-core';

import { setProperties } from './utils';

type CreateDomElementProps = Record<string, unknown> & {
  children?: Node[];
};

export function getCreateDomElement(environment: AutocompleteEnvironment) {
  return function createDomElement<KParam extends keyof HTMLElementTagNameMap>(
    tagName: KParam,
    { children = [], ...props }: CreateDomElementProps
  ): HTMLElementTagNameMap[KParam] {
    const element = environment.document.createElement<KParam>(tagName);
    setProperties(element, props);
    element.append(...children);

    return element;
  };
}
