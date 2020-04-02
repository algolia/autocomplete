import { createElement } from 'react';

import { InternalDocSearchHit } from './types';

function getPropertyByPath(object: object, path: string): any {
  const parts = path.split('.');

  return parts.reduce((current, key) => current && current[key], object);
}

interface SnippetProps {
  [prop: string]: unknown;
  hit: InternalDocSearchHit;
  attribute: string;
  tagName?: string;
}

export function Snippet({
  hit,
  attribute,
  tagName = 'span',
  ...rest
}: SnippetProps) {
  return createElement(tagName, {
    ...rest,
    dangerouslySetInnerHTML: {
      __html:
        getPropertyByPath(hit, `_snippetResult.${attribute}.value`) ||
        hit[attribute],
    },
  });
}
