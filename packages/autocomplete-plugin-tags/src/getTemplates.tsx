/** @jsx createElement */
import { SourceTemplates } from '@algolia/autocomplete-js';

import { Tag } from './types';

export function getTemplates<TTag>(): SourceTemplates<Tag<TTag>> {
  return {
    item({ item, createElement }) {
      return (
        <div className="aa-ItemWrapper">
          <div className="aa-ItemContent">
            <div className="aa-ItemIcon aa-ItemIcon--noBorder">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" />
              </svg>
            </div>
            <div className="aa-ItemContentBody">
              <div className="aa-ItemContentTitle">
                <span className="aa-ItemContentLabel">{item.label}</span>
              </div>
            </div>
          </div>
          <div className="aa-ItemActions">
            <button className="aa-ItemActionButton" title="Remove this tag">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
              </svg>
            </button>
          </div>
        </div>
      );
    },
  };
}
