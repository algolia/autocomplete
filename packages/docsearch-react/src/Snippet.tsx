import { createElement } from 'react';

import { StoredDocSearchHit } from './types';

function getPropertyByPath(object: object, path: string): any {
  const parts = path.split('.');

  return parts.reduce((current, key) => current && current[key], object);
}

interface SnippetProps<TItem> {
  [prop: string]: unknown;
  hit: TItem;
  attribute: string;
  tagName?: string;
}

export function Snippet<TItem extends StoredDocSearchHit>({
  hit,
  attribute,
  tagName = 'span',
  ...rest
}: SnippetProps<TItem>) {
  return createElement(tagName, {
    ...rest,
    dangerouslySetInnerHTML: {
      __html:
        getPropertyByPath(hit, `_snippetResult.${attribute}.value`) ||
        getPropertyByPath(hit, attribute),
    },
  });
}
