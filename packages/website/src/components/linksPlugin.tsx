import { AutocompletePlugin } from '@algolia/autocomplete-js';
import React from 'react';

type LinkItem = {
  label: string;
  url: string;
};

type CreateLinksPluginProps = {
  links: LinkItem[];
};

export function createLinksPlugin({
  links,
}: CreateLinksPluginProps): AutocompletePlugin<LinkItem, undefined> {
  return {
    getSources({ query }) {
      if (query) {
        return [];
      }

      return [
        {
          sourceId: 'links',
          getItems() {
            return links;
          },
          getItemUrl({ item }) {
            return item.url;
          },
          templates: {
            item({ item }) {
              return (
                <a className="aa-ItemLink" href={item.url}>
                  <div className="aa-ItemContent">
                    <div className="aa-ItemIcon aa-ItemIcon--noBorder">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </div>
                    <div className="aa-ItemContentBody">
                      <div className="aa-ItemContentTitle">{item.label}</div>
                    </div>
                  </div>
                </a>
              );
            },
          },
        },
      ];
    },
  };
}
