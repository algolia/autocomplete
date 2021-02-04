import { Hit } from '@algolia/client-search';
import React from 'react';

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
type DocSearchHit = Hit<DocSearchItem>;
type AutocompleteItemProps = { hit: DocSearchHit; breadcrumb: string[] };

export function AutocompleteDocSearchItem({
  hit,
  breadcrumb,
}: AutocompleteItemProps) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">{hit.hierarchy[hit.type]}</div>
        <div className="aa-ItemContentSubtitle">{breadcrumb.join(' • ')}</div>
      </div>
    </a>
  );
}
