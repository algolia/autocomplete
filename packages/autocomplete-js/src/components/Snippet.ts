import { parseAlgoliaHitSnippet } from '@algolia/autocomplete-preset-algolia';

import { AutocompleteRenderer, HighlightHitParams } from '../types';

export function createSnippetComponent({
  createElement,
  Fragment,
}: AutocompleteRenderer) {
  function Snippet<THit>({
    hit,
    attribute,
    tagName = 'mark',
  }: HighlightHitParams<THit>): JSX.Element {
    return createElement(
      Fragment,
      {},
      parseAlgoliaHitSnippet<THit>({ hit, attribute }).map((x, index) =>
        x.isHighlighted
          ? createElement(tagName, { key: index }, x.value)
          : x.value
      )
    );
  }

  Snippet.__autocomplete_componentName = 'Snippet';

  return Snippet;
}
