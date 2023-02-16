/** @jsxRuntime classic */
/** @jsx h */
import { AutocompleteComponents } from '@algolia/autocomplete-js';
import { h } from 'preact';

import { AutocompleteItem } from '../types';

type PostfixItemProps = {
  item: AutocompleteItem;
  components: AutocompleteComponents;
};

export function PostfixItem({ item, components }: PostfixItemProps) {
  return (
    <div className="aa-ItemWrapper">
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <strong>
              {item.token}:<components.Highlight hit={item} attribute="label" />
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
