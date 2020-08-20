import {
  AutocompleteState,
  GetDropdownProps,
  GetItemProps,
  GetMenuProps,
} from '@francoischalifour/autocomplete-core';
import React from 'react';

import { ReverseHighlight } from './Highlight';

interface DropdownProps {
  isOpen: boolean;
  status: string;
  suggestions: AutocompleteState<any>['suggestions'];
  getDropdownProps: GetDropdownProps<React.MouseEvent>;
  getMenuProps: GetMenuProps;
  getItemProps: GetItemProps<any, React.MouseEvent>;
  dropdownRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Dropdown = (props: DropdownProps) => {
  return (
    <div
      className={[
        'algolia-autocomplete-dropdown',
        status === 'stalled' && 'algolia-autocomplete-dropdown--stalled',
        status === 'error' && 'algolia-autocomplete-dropdown--errored',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={props.dropdownRef}
      hidden={!props.isOpen}
      {...props.getDropdownProps()}
    >
      {props.isOpen && (
        <div className="algolia-autocomplete-dropdown-container">
          {props.suggestions.map((suggestion, index) => {
            const { source, items } = suggestion;

            return (
              <section
                key={`result-${index}`}
                className="algolia-autocomplete-suggestions"
              >
                {items.length > 0 && (
                  <ul {...props.getMenuProps()}>
                    {items.map((item, index) => {
                      return (
                        <li
                          key={`item-${index}`}
                          className="algolia-autocomplete-suggestions-item"
                          {...props.getItemProps({
                            item,
                            source,
                          })}
                        >
                          <ReverseHighlight hit={item} attribute="query" />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
