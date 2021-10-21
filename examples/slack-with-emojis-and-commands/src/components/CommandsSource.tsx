import React from 'react';
import { Command, SourceProps } from '../types';

export function CommandsSource({
  source,
  items,
  autocomplete,
}: SourceProps<Command>) {
  return (
    <ul
      {...autocomplete.getListProps()}
      className="autocomplete-source source-commands"
    >
      {items.map((item: any) => {
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
          >
            <div
              className={[
                'autocomplete-item-icon',
                item.slug === 'videochat' && 'autocomplete-item-icon-videochat',
                item.slug === 'gif' && 'autocomplete-item-icon-gif',
                item.slug === 'survey' && 'autocomplete-item-icon-survey',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {item.icon}
            </div>
            <div className="autocomplete-item-content">
              <div className="autocomplete-item-title">
                {item.slug}{' '}
                {item.commands.length > 0 && `[${item.commands.join(', ')}]`}
              </div>
              <div className="autocomplete-item-description">
                {item.description}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
