import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { Snippet } from '../Snippet';
import { SourceIcon } from './SourceIcon';
import { SelectIcon } from './ActionIcon';
import { InternalDocSearchHit } from '../types';

interface ResultsProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  onItemClick(item: InternalDocSearchHit): void;
  onAction(search: InternalDocSearchHit): void;
}

export function Results(props: ResultsProps) {
  return (
    <div className="DocSearch-Dropdown-Container">
      {props.state.suggestions.map(({ source, items }) => {
        if (items.length === 0) {
          return null;
        }

        const title = items[0].hierarchy.lvl0;

        return (
          <section key={title} className="DocSearch-Hits">
            <div className="DocSearch-Hit-source">{title}</div>

            <ul {...props.getMenuProps()}>
              {items.map((item, index) => {
                return (
                  <li
                    key={item.objectID}
                    className={[
                      'DocSearch-Hit',
                      item.__docsearch_parent && 'DocSearch-Hit--Child',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    {...props.getItemProps({
                      item,
                      source,
                      onClick() {
                        props.onItemClick(item);
                      },
                    })}
                  >
                    <a href={item.url}>
                      <div className="DocSearch-Hit-Container">
                        {item.__docsearch_parent && (
                          <svg className="DocSearch-Hit-Tree">
                            <g
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              fillRule="evenodd"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {item.__docsearch_parent !==
                              items[index + 1]?.__docsearch_parent ? (
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

                        {item.hierarchy[item.type] && item.type === 'lvl1' && (
                          <div className="DocSearch-Hit-content-wrapper">
                            <Snippet
                              className="DocSearch-Hit-title"
                              hit={item}
                              attribute="hierarchy.lvl1"
                            />
                            {item.content && (
                              <Snippet
                                className="DocSearch-Hit-path"
                                hit={item}
                                attribute="content"
                              />
                            )}
                          </div>
                        )}

                        {item.hierarchy[item.type] &&
                          (item.type === 'lvl2' ||
                            item.type === 'lvl3' ||
                            item.type === 'lvl4' ||
                            item.type === 'lvl5' ||
                            item.type === 'lvl6') && (
                            <div className="DocSearch-Hit-content-wrapper">
                              <Snippet
                                className="DocSearch-Hit-title"
                                hit={item}
                                attribute={`hierarchy.${item.type}`}
                              />
                              <Snippet
                                className="DocSearch-Hit-path"
                                hit={item}
                                attribute="hierarchy.lvl1"
                              />
                            </div>
                          )}

                        {item.type === 'content' && (
                          <div className="DocSearch-Hit-content-wrapper">
                            <Snippet
                              className="DocSearch-Hit-title"
                              hit={item}
                              attribute="content"
                            />
                            <Snippet
                              className="DocSearch-Hit-path"
                              hit={item}
                              attribute="hierarchy.lvl1"
                            />
                          </div>
                        )}

                        <div className="DocSearch-Hit-action">
                          <SelectIcon />
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
