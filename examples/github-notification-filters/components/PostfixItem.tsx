/** @jsx h */
import { h } from 'preact';

import { AutocompleteItem } from '../types';

type PostfixItemProps = {
  item: AutocompleteItem;
};

export function PostfixItem({ item }: PostfixItemProps) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <strong>
              {item.token}:{item.label}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
