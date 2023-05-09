/** @jsxRuntime classic */
/** @jsx createElement */
import { SourceTemplates } from '@algolia/autocomplete-js';

import { RecentSearchesItem } from './types';

export type GetTemplatesParams<TItem extends RecentSearchesItem> = {
  onRemove(id: string): void;
  onTapAhead(item: TItem): void;
};

export function getTemplates<TItem extends RecentSearchesItem>({
  onRemove,
  onTapAhead,
}: GetTemplatesParams<TItem>): SourceTemplates<TItem> {
  return {
    item({ item, createElement, components }) {
      return (
        <div className="aa-ItemWrapper">
          <div className="aa-ItemContent">
            <div className="aa-ItemIcon aa-ItemIcon--noBorder">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.516 6.984v5.25l4.5 2.672-0.75 1.266-5.25-3.188v-6h1.5zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z" />
              </svg>
            </div>
            <div className="aa-ItemContentBody">
              <div className="aa-ItemContentTitle">
                <components.ReverseHighlight hit={item} attribute="label" />
                {item.category && (
                  <span className="aa-ItemContentSubtitle aa-ItemContentSubtitle--inline">
                    <span className="aa-ItemContentSubtitleIcon" /> in{' '}
                    <span className="aa-ItemContentSubtitleCategory">
                      {item.category}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="aa-ItemActions">
            <button
              className="aa-ItemActionButton"
              title="Remove this search"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onRemove(item.id);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
              </svg>
            </button>
            <button
              className="aa-ItemActionButton"
              title={`Fill query with "${item.label}"`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onTapAhead(item);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z" />
              </svg>
            </button>
          </div>
        </div>
      );
    },
  };
}
