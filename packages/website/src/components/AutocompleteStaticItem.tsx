import { Hit } from '@algolia/client-search';
import { reverseHighlightHit } from '@algolia/autocomplete-js';
import React from 'react';

type StaticItem = {
  label: string;
  url: string;
};

type StaticItemHit = Hit<StaticItem>;

type StaticItemProps = {
  hit: StaticItemHit;
};

export function AutocompleteStaticItem({ hit }: StaticItemProps) {
  return (
    <>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentTitle">
          <a href={hit.url}>
          {reverseHighlightHit<StaticItemHit>({
            hit,
            attribute: 'label',
          })}
          </a>
        </div>
      </div>
    </>
  );
}
