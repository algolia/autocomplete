import {
  AutocompleteApi,
  AutocompleteOptions,
  AutocompleteReshapeSource,
  InternalAutocompleteSource,
} from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import { Hit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import React, { useEffect, useRef } from 'react';

import { commands } from './commands';
import { CommandsSource } from './components/CommandsSource';
import { EmojisSource } from './components/EmojisSource';
import { useAutocomplete } from './hooks';
import { Command, Emoji } from './types';
import {
  getActiveToken,
  getCaretCoordinates,
  groupBy,
  isValidCommandSlug,
  isValidEmojiSlug,
  replaceAt,
} from './utils';

const searchClient = algoliasearch(
  'latency',
  'cc9db90d2f0e20780aa21362bb41dfd4'
);

export function Autocomplete(
  props: Partial<AutocompleteOptions<Command | Hit<Emoji>>>
) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { autocomplete, state } = useAutocomplete({
    ...props,
    id: 'emoji-autocomplete',
    defaultActiveItemId: 0,
    placeholder: 'Jot something down',
    autoFocus: true,
    insights: true,
    getSources({ query }) {
      const cursorPosition = inputRef.current?.selectionEnd || 0;
      const activeToken = getActiveToken(query, cursorPosition);

      if (activeToken?.word && isValidEmojiSlug(activeToken?.word)) {
        return [
          {
            sourceId: 'emojis',
            getItems() {
              const cleanQuery = activeToken.word
                .replaceAll(':', '')
                .replaceAll('-', ' ');

              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'autocomplete_emojis',
                    query: cleanQuery,
                    params: {
                      hitsPerPage: 100,
                    },
                  },
                ],
              });
            },
            onSelect({ item, setQuery }) {
              const [index] = activeToken.range;
              const replacement = `${(item as Hit<Emoji>).symbol} `;
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
          },
        ];
      }

      if (
        activeToken?.word &&
        activeToken?.range[0] === 0 &&
        isValidCommandSlug(activeToken?.word)
      ) {
        return [
          {
            sourceId: 'commands',
            getItems() {
              return commands.filter(({ slug }) =>
                slug.startsWith(activeToken?.word.slice(1))
              );
            },
            onSelect({ item, setQuery }) {
              const [index] = activeToken.range;
              const replacement = `/${item.slug} `;
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
          },
        ];
      }

      return [];
    },
    reshape({ sourcesBySourceId }) {
      const { emojis, commands } = sourcesBySourceId;

      if (emojis) {
        const emojisByGroup = groupBy(
          (emojis as AutocompleteReshapeSource<Hit<Emoji>>).getItems(),
          (item) => item.group
        );

        return Object.keys(emojisByGroup).map((group) => {
          return {
            ...emojis,
            sourceId: `emojis/${group}`,
            getItems() {
              return emojisByGroup[group];
            },
          };
        });
      }

      if (commands) {
        return [commands];
      }

      return [];
    },
  });
  const cursorPosition = inputRef.current?.selectionEnd || 0;
  const activeToken = getActiveToken(state.query, cursorPosition);
  const { top, height } = getCaretCoordinates(inputRef.current);
  const inputProps = autocomplete.getInputProps({
    inputElement: (inputRef.current as unknown) as HTMLInputElement,
  });

  useEffect(() => {
    if (
      activeToken?.word &&
      isValidEmojiSlug(activeToken.word) &&
      activeToken.word.endsWith(':') &&
      state.status === 'idle'
    ) {
      const [exactSlugMatch] = state.collections.map(({ items }) =>
        items.find((item) => item.slug === activeToken.word.replaceAll(':', ''))
      );

      if (exactSlugMatch) {
        const [index] = activeToken.range;
        const replacement = (exactSlugMatch as Hit<Emoji>).symbol;
        const newQuery = replaceAt(
          state.query,
          replacement,
          index,
          activeToken.word.length
        );

        autocomplete.setQuery(newQuery);

        requestAnimationFrame(() => {
          autocomplete.setIsOpen(false);
        });

        if (inputRef.current) {
          inputRef.current.selectionEnd = index + replacement.length;
        }
      }
    }
  }, [
    activeToken,
    state.status,
    state.collections,
    autocomplete,
    inputRef,
    cursorPosition,
  ]);

  return (
    <div {...autocomplete.getRootProps({})}>
      <div className="box">
        <div className="box-user">
          <img className="user-avatar" src="/avatar.jpg" />
          <div className="user-info">
            <div className="user-heading">
              <h2 className="user-name">Leon Hendricks</h2>
              <div className="user-status">
                <span className="sr-only">Online</span>
              </div>
            </div>
            <p className="user-handle">leon</p>
          </div>
        </div>
        <p className="box-intro">
          This is the very beginning of your direct message history with{' '}
          <span className="highlighted">@leon</span>
        </p>
        <div className="box-compose">
          <form
            {...autocomplete.getFormProps({
              inputElement: (inputRef.current as unknown) as HTMLInputElement,
            })}
            className="box-form"
          >
            <textarea className="box-textbox" ref={inputRef} {...inputProps} />
            <div className="box-help">
              <span>
                <kbd>:emoji:</kbd> for emojis
              </span>
              <span>
                <kbd>/</kbd> for commands
              </span>
            </div>
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
                if (items.length === 0) {
                  return null;
                }

                return (
                  <div key={`source-${source.sourceId}`}>
                    {source.sourceId === 'commands' && (
                      <CommandsSource
                        source={source as InternalAutocompleteSource<Command>}
                        items={items as Command[]}
                        autocomplete={
                          autocomplete as AutocompleteApi<
                            Command,
                            React.BaseSyntheticEvent<object, any, any>,
                            React.MouseEvent<Element, MouseEvent>,
                            React.KeyboardEvent<Element>
                          >
                        }
                      />
                    )}
                    {source.sourceId.startsWith('emojis/') && (
                      <EmojisSource
                        source={
                          source as InternalAutocompleteSource<Hit<Emoji>>
                        }
                        items={items as Array<Hit<Emoji>>}
                        autocomplete={
                          autocomplete as AutocompleteApi<
                            Hit<Emoji>,
                            React.BaseSyntheticEvent<object, any, any>,
                            React.MouseEvent<Element, MouseEvent>,
                            React.KeyboardEvent<Element>
                          >
                        }
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
