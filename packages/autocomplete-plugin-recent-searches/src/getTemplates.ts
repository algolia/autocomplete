import { SourceTemplates, reverseHighlightHit } from '@algolia/autocomplete-js';

import { RecentSearchesItem } from './types';

export type GetTemplatesParams = {
  onRemove(id: string): void;
};

export function getTemplates<TItem extends RecentSearchesItem>({
  onRemove,
}: GetTemplatesParams): SourceTemplates<TItem> {
  return {
    item({ item, createElement, Fragment }) {
      return createElement(Fragment, {
        children: [
          createElement('div', {
            className: 'aa-ItemContent',
            children: [
              createElement('div', {
                className: 'aa-ItemSourceIcon',
                children: [
                  createElement(
                    'svg',
                    {
                      width: '20',
                      height: '20',
                      viewBox: '0 0 22 22',
                      fill: 'currentColor',
                    },
                    createElement('path', {
                      d: 'M0 0h24v24H0z',
                      fill: 'none',
                    }),
                    createElement('path', {
                      d:
                        'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
                    })
                  ),
                ],
              }),
              createElement('div', {
                className: 'aa-ItemTitle',
                dangerouslySetInnerHTML: {
                  __html: reverseHighlightHit({
                    hit: item as any,
                    attribute: 'query',
                  }),
                },
              }),
            ],
          }),
          createElement('button', {
            className: 'aa-ItemActionButton',
            title: 'Remove',
            onClick(event: MouseEvent) {
              event.stopPropagation();
              onRemove(item.id);
            },
            children: [
              createElement(
                'svg',
                {
                  width: '20',
                  height: '20',
                  viewBox: '0 0 20 20',
                  fill: 'currentColor',
                },
                createElement('path', {
                  d:
                    'M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z',
                  stroke: 'currentColor',
                  fill: 'none',
                  'fill-rule': 'evenodd',
                  'stroke-width': '1.4',
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                })
              ),
            ],
          }),
        ],
      });
    },
  };
}
