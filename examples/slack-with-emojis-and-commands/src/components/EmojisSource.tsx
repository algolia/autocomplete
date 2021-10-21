import React from 'react';
import { Hit } from '@algolia/client-search';

import { Emoji, SourceProps } from '../types';

export function EmojisSource({
  source,
  items,
  autocomplete,
}: SourceProps<Hit<Emoji>>) {
  const [, category] = source.sourceId.split('/');

  return (
    <>
      <h2 className="autocomplete-header">{category}</h2>
      <ul
        {...autocomplete.getListProps()}
        className="autocomplete-source source-emojis"
      >
        {items.map((item) => {
          const itemProps = autocomplete.getItemProps({
            item,
            source,
          });

          return (
            <li
              key={item.slug}
              {...itemProps}
              className={[
                'autocomplete-item',
                itemProps['aria-selected'] && 'autocomplete-item-selected',
              ]
                .filter(Boolean)
                .join(' ')}
              title={item.name}
            >
              {item.symbol}
            </li>
          );
        })}
      </ul>
    </>
  );
}
