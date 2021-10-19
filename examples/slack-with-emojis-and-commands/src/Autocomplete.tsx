import { AutocompleteOptions } from '@algolia/autocomplete-core';
import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import algoliasearch from 'algoliasearch/lite';
import React, { useRef } from 'react';
import getCaretCoordinates from 'textarea-caret';

import { useAutocomplete } from './hooks';
import type { Emoji } from './types';
import { getActiveToken, groupBy, isValidEmoji, replaceAt } from './utils';

const searchClient = algoliasearch(
  'HSORS1ROJD',
  'a8390905cae1d110277c740275a00beb'
);

export function Autocomplete(props: Partial<AutocompleteOptions<any>>) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { autocomplete, state } = useAutocomplete({
    ...props,
    id: 'emoji-autocomplete',
    defaultActiveItemId: 0,
    getSources({ query }) {
      const cursorPosition = inputRef.current?.selectionEnd || 0;
      const activeToken = getActiveToken(query, cursorPosition);

      if (activeToken?.word && isValidEmoji(activeToken?.word)) {
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
                    indexName: 'emojis',
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
              const replacement = `${item.symbol} `;
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
      if (sourcesBySourceId.emojis) {
        const { emojis } = sourcesBySourceId;

        const emojisByGroup = groupBy(emojis.getItems(), ({ group }) => group);

        return Object.keys(emojisByGroup).map((group) => {
          return {
            ...emojis,
            sourceId: group,
            getItems() {
              return emojisByGroup[group];
            },
          };
        });
      }

      return [];
    },
  });

  const { top, height } = inputRef.current
    ? getCaretCoordinates(inputRef.current, inputRef.current?.selectionEnd)
    : { top: 0, height: 0 };

  const inputProps = autocomplete.getInputProps({
    inputElement: (inputRef.current as unknown) as HTMLInputElement,
    autoFocus: true,
  });

  return (
    <div {...autocomplete.getRootProps({})}>
      <div className="box p-6 text-gray-800">
        <div className="box-body grid grid-flow-row gap-6">
          <div className="grid grid-flow-col auto-cols-max items-center gap-4">
            <img className="w-20 h-20 rounded" src="/avatar.jpg" />
            <div className="grid grid-flow-row">
              <div className="grid grid-flow-col auto-cols-max items-center gap-2">
                <h2 className="font-semibold">Leon Hendricks</h2>
                <div className="rounded-full w-2 h-2 mt-0.5 bg-green-600">
                  <span className="sr-only">Online</span>
                </div>
              </div>
              <p className="text-gray-400">leon</p>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            This is the very beginning of your direct message history with{' '}
            <span className="bg-blue-100 text-blue-400 rounded py-0.5 px-1">
              @leon
            </span>
          </p>
          <div className="box-compose relative">
            <form
              {...autocomplete.getFormProps({
                inputElement: (inputRef.current as unknown) as HTMLInputElement,
              })}
            >
              <textarea
                className="w-full py-3 px-4 bg-white rounded-md border-gray-200 h-32 border-2 resize-none"
                ref={inputRef}
                {...inputProps}
              />
            </form>
            {state.isOpen && (
              <div
                {...autocomplete.getPanelProps({})}
                className="absolute grid auto-rows-auto gap-y-3 bg-white border-gray-200 border rounded-md w-72 shadow-lg p-1 max-h-56 overflow-y-scroll"
                style={{ top: `${top + height}px` }}
              >
                {state.collections.map(({ source, items }) => {
                  return (
                    <div key={`source-${source.sourceId}`}>
                      {items.length > 0 && (
                        <>
                          <h2 className="uppercase text-xs text-gray-400 mb-2">
                            {source.sourceId}
                          </h2>
                          <ul
                            {...autocomplete.getListProps()}
                            className="grid grid-cols-8 auto-rows-min gap-y-1"
                          >
                            {items.map((item) => {
                              const itemProps = autocomplete.getItemProps({
                                item,
                                source,
                              });

                              return (
                                <li
                                  key={item.slug}
                                  {...itemProps}
                                  className={[
                                    'text-center cursor-pointer rounded',
                                    itemProps['aria-selected'] && 'bg-gray-100',
                                  ]
                                    .filter(Boolean)
                                    .join(' ')}
                                >
                                  <div>
                                    <EmojiItem hit={item} />
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type EmojiItemProps = {
  hit: Emoji;
};

function EmojiItem({ hit }: EmojiItemProps) {
  return (
    <div title={hit.name} className="py-1 text-xl">
      {hit.symbol}
    </div>
  );
}
