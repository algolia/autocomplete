import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit } from './types';
import { Results } from './Results';
import { SourceIcon, SelectIcon } from './icons';

interface ResultsProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  onItemClick(item: InternalDocSearchHit): void;
}

export function ResultsScreen(props: ResultsProps) {
  return (
    <div className="DocSearch-Dropdown-Container">
      {props.state.suggestions.map((suggestion, index) => {
        if (suggestion.items.length === 0) {
          return null;
        }

        const title = suggestion.items[0].hierarchy.lvl0;

        return (
          <Results
            {...props}
            key={index}
            title={title}
            suggestion={suggestion}
            renderIcon={({ item, index }) => (
              <>
                {item.__docsearch_parent && (
                  <svg className="DocSearch-Hit-Tree">
                    <g
                      stroke="currentColor"
                      fill="none"
                      fillRule="evenodd"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.__docsearch_parent !==
                      suggestion.items[index + 1]?.__docsearch_parent ? (
                        <path d="M8 8v22M26.5 30H8.3" />
                      ) : (
                        <path d="M8 8v44M26.5 30H8.3" />
                      )}
                    </g>
                  </svg>
                )}

                <div className="DocSearch-Hit-icon">
                  <SourceIcon type={item.type} />
                </div>
              </>
            )}
            renderAction={() => (
              <div className="DocSearch-Hit-action">
                <SelectIcon />
              </div>
            )}
          />
        );
      })}
    </div>
  );
}
