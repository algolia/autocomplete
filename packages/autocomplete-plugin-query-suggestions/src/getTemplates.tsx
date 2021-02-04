/** @jsx createElement */
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
      return (
        <Fragment>
          <div className="aa-ItemIcon aa-ItemIcon--no-border">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                stroke="currentColor"
                fill="none"
                fillRule="evenodd"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="aa-ItemContent">
            <div className="aa-ItemContentTitle">
              {reverseHighlightHit<QuerySuggestionsHit>({
                hit: item,
                attribute: 'query',
              })}
            </div>
          </div>
          <button
            className="aa-ItemActionButton"
            title={`Fill query with "${item.query}"`}
            onClick={(event) => {
              event.stopPropagation();
              onTapAhead(item);
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <rect fill="none" height="24" width="24" />
              <path d="M5,15h2V8.41L18.59,20L20,18.59L8.41,7H15V5H5V15z" />
            </svg>
          </button>
        </Fragment>
      );
    },
  };
}
