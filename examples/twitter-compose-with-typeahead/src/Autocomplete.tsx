import { AutocompleteOptions } from '@algolia/autocomplete-core';
import {
  getAlgoliaResults,
  parseAlgoliaHitHighlight,
} from '@algolia/autocomplete-preset-algolia';
import type { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import React, { Fragment, useRef } from 'react';
import getCaretCoordinates from 'textarea-caret';

import { useAutocomplete } from './hooks';
import type { Account, AutocompleteItem } from './types';
import { getActiveToken, isValidTwitterUsername, replaceAt } from './utils';

const searchClient = algoliasearch(
  'latency',
  'a4390aa69f26de2fd0c4209ff113a4f9'
);

export function Autocomplete(
  props: Partial<AutocompleteOptions<AutocompleteItem>>
) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { autocomplete, state } = useAutocomplete({
    ...props,
    id: 'twitter-autocomplete',
    defaultActiveItemId: 0,
    insights: true,
    getSources({ query }) {
      const cursorPosition = inputRef.current?.selectionEnd || 0;
      const activeToken = getActiveToken(query, cursorPosition);

      if (activeToken?.word && isValidTwitterUsername(activeToken?.word)) {
        return [
          {
            sourceId: 'accounts',
            onSelect({ item, setQuery }) {
              const [index] = activeToken.range;
              const replacement = `@${item.handle} `;
              const newQuery = replaceAt(
                query,
                replacement,
                index,
                activeToken.word.length
              );

              setQuery(newQuery);

              if (inputRef.current) {
                inputRef.current.selectionEnd = index + replacement.length;
              }
            },
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'autocomplete_twitter_accounts',
                    query: activeToken.word.slice(1),
                    params: {
                      hitsPerPage: 8,
                    },
                  },
                ],
              });
            },
          },
        ];
      }

      return [];
    },
  });

  function onInputNavigate() {
    const cursorPosition = inputRef.current?.selectionEnd || 0;
    const activeToken = getActiveToken(state.query, cursorPosition);
    const shouldOpen = isValidTwitterUsername(activeToken?.word || '');

    autocomplete.setIsOpen(shouldOpen);
    autocomplete.refresh();
  }

  const { top, height } = inputRef.current
    ? getCaretCoordinates(inputRef.current, inputRef.current?.selectionEnd)
    : { top: 0, height: 0 };

  const inputProps = autocomplete.getInputProps({
    inputElement: (inputRef.current as unknown) as HTMLInputElement,
    autoFocus: true,
    maxLength: 280,
  });

  return (
    <div {...autocomplete.getRootProps({})}>
      <div className="box">
        <div className="box-body">
          <div className="box-avatar">
            <img src="https://robohash.org/autocomplete" alt="You" />
          </div>
          <div className="box-compose">
            <form
              {...autocomplete.getFormProps({
                inputElement: (inputRef.current as unknown) as HTMLInputElement,
              })}
            >
              <textarea
                className="box-textbox"
                ref={inputRef}
                {...inputProps}
                onKeyUp={(event) => {
                  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                    onInputNavigate();
                  }
                }}
                onClick={(event) => {
                  inputProps.onClick(event);

                  onInputNavigate();
                }}
              />
            </form>
            <div
              {...autocomplete.getPanelProps({})}
              className="autocomplete-panel"
              style={{ top: `${top + height}px` }}
            >
              {state.status === 'stalled' && !state.isOpen && (
                <div className="autocomplete-loading">
                  <svg
                    className="autocomplete-loading-icon"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="164.93361431346415 56.97787143782138"
                      strokeWidth="6"
                    >
                      <animateTransform
                        attributeName="transform"
                        dur="1s"
                        keyTimes="0;0.40;0.65;1"
                        repeatCount="indefinite"
                        type="rotate"
                        values="0 50 50;90 50 50;180 50 50;360 50 50"
                      ></animateTransform>
                    </circle>
                  </svg>
                </div>
              )}
              {state.isOpen &&
                state.collections.map(({ source, items }) => {
                  return (
                    <div
                      key={`source-${source.sourceId}`}
                      className={[
                        'autocomplete-source',
                        state.status === 'stalled' &&
                          'autocomplete-source-stalled',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {items.length > 0 && (
                        <ul
                          {...autocomplete.getListProps()}
                          className="autocomplete-items"
                        >
                          {items.map((item) => {
                            const itemProps = autocomplete.getItemProps({
                              item,
                              source,
                            });

                            return (
                              <li key={item.handle} {...itemProps}>
                                <div
                                  className={[
                                    'autocomplete-item',
                                    itemProps['aria-selected'] &&
                                      'autocomplete-item-selected',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  <AccountItem hit={item} />
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="box-footer">
          <button type="submit" className="tweet-button">
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}

type AccountItemProps = {
  hit: Hit<Account>;
};

function AccountItem({ hit }: AccountItemProps) {
  return (
    <div className="account-body">
      <div className="account-avatar">
        <img src={hit.image} alt="" />
      </div>
      <div>
        <div className="account-name">
          <Highlight hit={hit} attribute="name" />
        </div>
        <div className="account-handle">
          @<Highlight hit={hit} attribute="handle" />
        </div>
      </div>
    </div>
  );
}

type HighlightParams<THit> = {
  hit: THit;
  attribute: keyof THit | string[];
};

function Highlight<THit>({ hit, attribute }: HighlightParams<THit>) {
  return (
    <>
      {parseAlgoliaHitHighlight({
        hit,
        attribute,
      }).map(({ value, isHighlighted }, index) => {
        if (isHighlighted) {
          return (
            <mark key={index} className="account-highlighted">
              {value}
            </mark>
          );
        }

        return <Fragment key={index}>{value}</Fragment>;
      })}
    </>
  );
}
