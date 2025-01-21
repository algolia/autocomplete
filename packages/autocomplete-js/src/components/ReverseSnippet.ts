import { parseAlgoliaHitReverseSnippet } from '@algolia/autocomplete-preset-algolia';

import { AutocompleteRenderer, HighlightHitParams, VNode } from '../types';

export function createReverseSnippetComponent({
  createElement,
  Fragment,
}: AutocompleteRenderer) {
  function ReverseSnippet<THit>({
    hit,
    attribute,
    tagName = 'mark',
  }: HighlightHitParams<THit>): VNode<any> {
    return createElement(
      Fragment,
      {},
      parseAlgoliaHitReverseSnippet<THit>({
        hit,
        attribute,
      }).map((x, index) =>
        x.isHighlighted
          ? createElement(tagName, { key: index }, x.value)
          : x.value
      )
    );
  }

  ReverseSnippet.__autocomplete_componentName = 'ReverseSnippet';

  return ReverseSnippet;
}
