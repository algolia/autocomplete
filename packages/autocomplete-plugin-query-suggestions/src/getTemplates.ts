import { reverseHighlightHit, SourceTemplates } from '@algolia/autocomplete-js';

import { QuerySuggestionsHit } from './types';

export type GetTemplatesParams<TItem extends QuerySuggestionsHit> = {
  onTapAhead(item: TItem): void;
};

export function getTemplates<TItem extends QuerySuggestionsHit>({
  onTapAhead,
}: GetTemplatesParams<TItem>): SourceTemplates<TItem> {
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
                      viewBox: '0 0 20 20',
                    },
                    createElement('path', {
                      d:
                        'M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z',
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
              createElement('div', {
                className: 'aa-ItemTitle',
                children: reverseHighlightHit<any>({
                  hit: item,
                  attribute: 'query',
                }),
              }),
            ],
          }),
          createElement('button', {
            className: 'aa-ItemActionButton',
            title: `Fill query with "${item.query}"`,
            onClick(event: MouseEvent) {
              event.stopPropagation();
              onTapAhead(item);
            },
            children: [
              createElement(
                'svg',
                {
                  viewBox: '0 0 24 24',
                  fill: 'currentColor',
                  width: '18',
                  height: '18',
                },
                createElement('rect', {
                  fill: 'none',
                  height: '24',
                  width: '24',
                }),
                createElement('path', {
                  d: 'M5,15h2V8.41L18.59,20L20,18.59L8.41,7H15V5H5V15z',
                })
              ),
            ],
          }),
        ],
      });
    },
  };
}
