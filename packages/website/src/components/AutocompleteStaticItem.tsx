import React from 'react';

type StaticItem = {
  label: string;
  url: string;
};

type AutocompleteStaticItemProps = {
  hit: StaticItem;
};

export function AutocompleteStaticItem({ hit }: AutocompleteStaticItemProps) {
  return (
    <a className="aa-ItemLink" href={hit.url}>
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--noBorder">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">{hit.label}</div>
        </div>
      </div>
    </a>
  );
}
