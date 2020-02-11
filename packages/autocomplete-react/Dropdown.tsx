/** @jsx h */

import { h } from 'preact';

import { reverseHighlightAlgoliaHit } from '../autocomplete-presets';

interface DropdownProps {
  isOpen: boolean;
  suggestions: any;
  status: string;
  getItemProps(options?: object): any;
  getMenuProps(options?: object): any;
}

export const Dropdown = ({
  isOpen,
  status,
  suggestions,
  getItemProps,
  getMenuProps,
}: DropdownProps) => {
  return (
    <div
      hidden={!isOpen}
      className={[
        'algolia-autocomplete-dropdown',
        status === 'stalled' && 'algolia-autocomplete-dropdown--stalled',
        status === 'error' && 'algolia-autocomplete-dropdown--errored',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="algolia-autocomplete-dropdown-container">
        {suggestions.map((suggestion, index) => {
          const { source, items } = suggestion;

          return (
            <section
              key={`result-${index}`}
              className="algolia-autocomplete-suggestions"
            >
              {items.length > 0 && (
                <ul {...getMenuProps()}>
                  {items.map((item, index) => {
                    return (
                      <li
                        key={`item-${index}`}
                        className="algolia-autocomplete-suggestions-item"
                        {...getItemProps({
                          item,
                          source,
                          tabIndex: 0,
                        })}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: reverseHighlightAlgoliaHit({
                              hit: item,
                              attribute: 'query',
                            }),
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
