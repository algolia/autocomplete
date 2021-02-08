/** @jsx createElement */
import { reverseHighlightHit, SourceTemplates } from '@algolia/autocomplete-js';

import { RecentSearchesItem } from './types';

export type GetTemplatesParams = {
  onRemove(id: string): void;
};

export function getTemplates<TItem extends RecentSearchesItem>({
  onRemove,
}: GetTemplatesParams): SourceTemplates<TItem> {
  return {
    item({ item, createElement, Fragment }) {
      return (
        <Fragment>
          <div className="aa-ItemIcon aa-ItemIcon--no-border">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
            </svg>
          </div>
          <div className="aa-ItemContent">
            <div className="aa-ItemContentTitle">
              {reverseHighlightHit<any>({
                hit: item,
                attribute: 'query',
                createElement,
              })}
            </div>
          </div>
          <div className="aa-ItemActions">
            <button
              className="aa-ItemActionButton"
              title="Remove this search"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(item.id);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        </Fragment>
      );
    },
  };
}
