/** @jsxRuntime classic */
/** @jsx h */
import { h } from 'preact';

import { AutocompleteItem } from '../types';

type PrefixItemProps = {
  item: AutocompleteItem;
};

export function PrefixItem({ item }: PrefixItemProps) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <strong>{item.token}:</strong> {item.label}
          </div>
        </div>
      </div>
    </div>
  );
}
