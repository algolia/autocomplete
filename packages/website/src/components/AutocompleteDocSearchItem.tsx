import { snippetHit } from '@algolia/autocomplete-js';
import { Hit } from '@algolia/client-search';
import React, { createElement } from 'react';

type DocSearchItem = {
  content: string | null;
  url: string;
  url_without_anchor: string;
  type:
    | 'content'
    | 'lvl0'
    | 'lvl1'
    | 'lvl2'
    | 'lvl3'
    | 'lvl4'
    | 'lvl5'
    | 'lvl6';
  anchor: string | null;
  hierarchy: {
    lvl0: string;
    lvl1: string;
    lvl2: string | null;
    lvl3: string | null;
    lvl4: string | null;
    lvl5: string | null;
    lvl6: string | null;
  };
};
type AutocompleteItemProps = {
  hit: Hit<DocSearchItem>;
  breadcrumb: string[];
};

export function AutocompleteDocSearchItem({
  hit,
  breadcrumb,
}: AutocompleteItemProps) {
  const title = snippetHit({
    hit,
    attribute: hit.type === 'content' ? 'content' : ['hierarchy', hit.type],
    createElement,
  });

  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">{title}</div>
        <div className="aa-ItemContentSubtitle">{breadcrumb.join(' • ')}</div>
      </div>
    </a>
  );
}
