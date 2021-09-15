import React, { Fragment, useRef } from 'react';
import { AutocompleteOptions } from '@algolia/autocomplete-core';
import {
  getAlgoliaResults,
  parseAlgoliaHitHighlight,
} from '@algolia/autocomplete-preset-algolia';
import type { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import getCaretCoordinates from 'textarea-caret';

import { useAutocomplete } from './hooks';
import type { QueryToken, Account, AutocompleteItem } from './types';
import { isValidTwitterUsername, replaceAt } from './utils';

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
    getSources({ query }) {
      const cursorPosition = inputRef.current?.selectionEnd;
      const tokenizedQuery = query
        .split(/[\s\n]/)
        .reduce((acc, word, index) => {
          const previous = acc[index - 1];
          const start = index === 0 ? index : previous.range[1] + 1;
          const end = start + word.length;

          return acc.concat([{ word, range: [start, end] }]);
        }, [] as QueryToken[]);

      if (cursorPosition) {
        const activeToken = tokenizedQuery.find((token) =>
          token.range.includes(cursorPosition)
        );

        if (activeToken?.word && isValidTwitterUsername(activeToken?.word)) {
          return [
            {
              sourceId: 'accounts',
              onSelect({ item, setQuery }) {
                const [index] = activeToken.range;
                const replacement = `@${item.handle}`;
                const newQuery = replaceAt(query, replacement, index);

                setQuery(newQuery);
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
      }

      return [];
    },
  });

  const { top, height } = inputRef.current
    ? getCaretCoordinates(inputRef.current, inputRef.current?.selectionEnd)
    : { top: 0, height: 0 };

  return (
    <div {...autocomplete.getRootProps({})}>
      <div className="box">
        <div className="box-body">
          <div className="box-avatar">
            <img src="https://robohash.org/autocomplete" alt="" />
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
                {...autocomplete.getInputProps({
                  inputElement: (inputRef.current as unknown) as HTMLInputElement,
                })}
                spellCheck={false}
                autoFocus={true}
                maxLength={280}
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
    <>
      {(hit.follows_me || hit.followed_by_me) && (
        <div className="account-follow-status">
          <svg
            className="account-follow-status-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          {hit.follows_me && hit.followed_by_me && (
            <span>You follow each other</span>
          )}
          {!hit.follows_me && hit.followed_by_me && (
            <span>You follow them</span>
          )}
          {hit.follows_me && !hit.followed_by_me && (
            <span>They follow you</span>
          )}
        </div>
      )}
      <div className="account-body">
        <div className="account-avatar">
          <img src={hit.image} alt="" />
        </div>
        <div>
          <div className="account-name">
            {hit.name !== '' && (
              <span>
                <Highlight hit={hit} attribute="name" />
              </span>
            )}
            {hit.verified && (
              <svg
                className="account-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-label="Verified account"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="account-handle">
            @<Highlight hit={hit} attribute="handle" />
          </div>
        </div>
      </div>
    </>
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
