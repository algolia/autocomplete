import React, { useRef, useEffect } from 'react';
import {
  createAutocomplete,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';

import { DocSearchHit, InternalDocSearchHit } from './types';
import { createSearchClient, groupBy, noop } from './utils';
import { SearchBox } from './SearchBox';
import { Dropdown } from './Dropdown';
import { Footer } from './Footer';

interface DocSearchProps {
  appId?: string;
  apiKey: string;
  indexName: string;
  searchParameters: any;
  onClose(): void;
}

export function DocSearch({
  appId = 'BH4D9OD16A',
  apiKey,
  indexName,
  searchParameters,
  onClose = noop,
}: DocSearchProps) {
  const [state, setState] = React.useState<
    AutocompleteState<InternalDocSearchHit>
  >({
    query: '',
    suggestions: [],
  } as any);

  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const snipetLength = useRef<number>(10);

  const searchClient = React.useMemo(() => createSearchClient(appId, apiKey), [
    appId,
    apiKey,
  ]);

  const {
    getEnvironmentProps,
    getRootProps,
    getFormProps,
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
  } = React.useMemo(
    () =>
      createAutocomplete<
        InternalDocSearchHit,
        React.FormEvent<HTMLFormElement>,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        defaultHighlightedIndex: 0,
        autoFocus: true,
        placeholder: 'Search docs...',
        openOnFocus: true,
        onStateChange({ state }) {
          setState(state as any);
        },
        getSources({ query }) {
          return getAlgoliaHits({
            searchClient,
            queries: [
              {
                indexName,
                query,
                params: {
                  attributesToRetrieve: [
                    'hierarchy.lvl0',
                    'hierarchy.lvl1',
                    'hierarchy.lvl2',
                    'hierarchy.lvl3',
                    'hierarchy.lvl4',
                    'hierarchy.lvl5',
                    'hierarchy.lvl6',
                    'content',
                    'type',
                    'url',
                  ],
                  attributesToSnippet: [
                    `hierarchy.lvl1:${snipetLength.current}`,
                    `hierarchy.lvl2:${snipetLength.current}`,
                    `hierarchy.lvl3:${snipetLength.current}`,
                    `hierarchy.lvl4:${snipetLength.current}`,
                    `hierarchy.lvl5:${snipetLength.current}`,
                    `hierarchy.lvl6:${snipetLength.current}`,
                    `content:${snipetLength.current}`,
                  ],
                  snippetEllipsisText: '…',
                  highlightPreTag: '<mark>',
                  highlightPostTag: '</mark>',
                  hitsPerPage: 20,
                  distinct: 4,
                  ...searchParameters,
                },
              },
            ],
          }).then((hits: DocSearchHit[]) => {
            const formattedHits = hits.map(hit => {
              const url = new URL(hit.url);
              return {
                ...hit,
                url: hit.url
                  // @TODO: temporary convenience for development.
                  .replace(url.origin, '')
                  .replace('#__docusaurus', ''),
              };
            });
            const sources = groupBy(formattedHits, hit => hit.hierarchy.lvl0);

            return Object.values<DocSearchHit[]>(sources).map(items => {
              return {
                onSelect() {
                  onClose();
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                getSuggestions() {
                  return Object.values(
                    groupBy(items, item => item.hierarchy.lvl1)
                  )
                    .map(hits =>
                      hits.map(item => {
                        return {
                          ...item,
                          // eslint-disable-next-line @typescript-eslint/camelcase
                          __docsearch_parent:
                            item.type !== 'lvl1' &&
                            hits.find(
                              siblingItem =>
                                siblingItem.type === 'lvl1' &&
                                siblingItem.hierarchy.lvl1 ===
                                  item.hierarchy.lvl1
                            ),
                        };
                      })
                    )
                    .flat();
                },
              };
            });
          });
        },
      }),
    [indexName, searchParameters, searchClient, onClose]
  );

  useEffect(() => {
    const isMobileMediaQuery = window.matchMedia('(max-width: 750px)');

    if (isMobileMediaQuery.matches) {
      snipetLength.current = 5;
    }
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [state.query]);

  useEffect(() => {
    if (!(searchBoxRef.current && dropdownRef.current && inputRef.current)) {
      return undefined;
    }

    const { onTouchStart, onTouchMove } = getEnvironmentProps({
      searchBoxElement: searchBoxRef.current,
      dropdownElement: dropdownRef.current,
      inputElement: inputRef.current,
    });

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [getEnvironmentProps, searchBoxRef, dropdownRef, inputRef]);

  return (
    <div
      className={[
        'DocSearch-Container',
        state.status === 'stalled' && 'DocSearch-Container--Stalled',
        state.status === 'error' && 'DocSearch-Container--Errored',
      ]
        .filter(Boolean)
        .join(' ')}
      {...getRootProps({
        onClick(event: React.MouseEvent) {
          if (event.target === event.currentTarget) {
            onClose();
          }
        },
      })}
    >
      <div className="DocSearch-Modal">
        <header className="DocSearch-SearchBar" ref={searchBoxRef}>
          <SearchBox
            inputRef={inputRef}
            query={state.query}
            getFormProps={getFormProps}
            getLabelProps={getLabelProps}
            getInputProps={getInputProps}
            onClose={onClose}
          />
        </header>

        <div className="DocSearch-Dropdown" ref={dropdownRef}>
          <Dropdown
            state={state}
            getMenuProps={getMenuProps}
            getItemProps={getItemProps}
          />
        </div>

        <footer className="DocSearch-Footer">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
