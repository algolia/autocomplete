import { reverseHighlightHit, SourceTemplates } from '@algolia/autocomplete-js';

import { QuerySuggestionsHit } from './types';

export type GetTemplatesParams<TItem extends QuerySuggestionsHit> = {
  onTapAhead(item: TItem): void;
};

export function getTemplates<TItem extends QuerySuggestionsHit>({
  onTapAhead,
}: GetTemplatesParams<TItem>): SourceTemplates<TItem> {
  return {
    item({ item, pragma, pragmaFrag }) {
      return pragma(pragmaFrag, {
        children: [
          pragma('div', {
            className: 'aa-ItemContent',
            children: [
              pragma('div', {
                className: 'aa-ItemSourceIcon',
                children: [
                  pragma(
                    'svg',
                    {
                      width: '20',
                      height: '20',
                      viewBox: '0 0 20 20',
                    },
                    pragma('path', {
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
              pragma('div', {
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
          pragma('button', {
            className: 'aa-ItemActionButton',
            title: `Fill query with "${item.query}"`,
            onClick(event: MouseEvent) {
              event.stopPropagation();
              onTapAhead(item);
            },
            children: [
              pragma(
                'svg',
                {
                  viewBox: '0 0 24 24',
                  fill: 'currentColor',
                  width: '18',
                  height: '18',
                },
                pragma('rect', {
                  fill: 'none',
                  height: '24',
                  width: '24',
                }),
                pragma('path', {
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
