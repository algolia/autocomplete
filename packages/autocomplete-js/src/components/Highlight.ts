import { parseAlgoliaHitHighlight } from '@algolia/autocomplete-preset-algolia';

import { AutocompleteRenderer, HighlightHitParams, VNode } from '../types';

export function createHighlightComponent({
  createElement,
  Fragment,
}: AutocompleteRenderer) {
  function Highlight<THit>({
    hit,
    attribute,
    tagName = 'mark',
  }: HighlightHitParams<THit>): VNode<any> {
    return createElement(
      Fragment,
      {},
      parseAlgoliaHitHighlight<THit>({ hit, attribute }).map((x, index) =>
        x.isHighlighted
          ? createElement(tagName, { key: index }, x.value)
          : x.value
      )
    );
  }

  Highlight.__autocomplete_componentName = 'Highlight';

  return Highlight;
}
