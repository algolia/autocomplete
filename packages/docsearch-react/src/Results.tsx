import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import {
  DocSearchHit,
  InternalDocSearchHit,
  StoredDocSearchHit,
} from './types';
import { Snippet } from './Snippet';

interface ResultsProps<TItem>
  extends AutocompleteApi<
    TItem,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  title: string;
  suggestion: AutocompleteState<TItem>['suggestions'][0];
  renderIcon(props: { item: TItem; index: number }): React.ReactNode;
  renderAction(props: { item: TItem }): React.ReactNode;
  onItemClick(item: TItem): void;
  hitComponent(props: {
    hit: DocSearchHit;
    children: React.ReactNode;
  }): JSX.Element;
}

export function Results<TItem extends StoredDocSearchHit>(
  props: ResultsProps<TItem>
) {
  if (props.suggestion.items.length === 0) {
    return null;
  }

  const Hit = props.hitComponent;

  return (
    <section className="DocSearch-Hits">
      <div className="DocSearch-Hit-source">{props.title}</div>

      <ul {...props.getMenuProps()}>
        {props.suggestion.items.map((item, index) => {
          return (
            <li
              key={[item.objectID, index].join(':')}
              className={[
                'DocSearch-Hit',
                ((item as unknown) as InternalDocSearchHit)
                  .__docsearch_parent && 'DocSearch-Hit--Child',
              ]
                .filter(Boolean)
                .join(' ')}
              {...props.getItemProps({
                item,
                source: props.suggestion.source,
                onClick() {
                  props.onItemClick(item);
                },
              })}
            >
              <Hit hit={item}>
                <div className="DocSearch-Hit-Container">
                  {props.renderIcon({ item, index })}

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

                  {props.renderAction({ item })}
                </div>
              </Hit>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
