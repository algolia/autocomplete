/** @jsx createElement */
import { SourceTemplates } from '@algolia/autocomplete-js';

import { Tag } from './types';

export function getTemplates<TTag>(): SourceTemplates<Tag<TTag>> {
  return {
    item({ item, createElement }) {
      return (
        <div className="aa-ItemWrapper">
          <div className="aa-ItemContent">
            <div className="aa-ItemIcon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="aa-ItemContentBody">
              <div className="aa-ItemContentTitle">
                <span className="aa-ItemContentLabel">{item.label}</span>
              </div>
            </div>
          </div>
          <div className="aa-ItemActions">
            <button
              className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
              type="button"
              title="Remove"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      );
    },
  };
}
