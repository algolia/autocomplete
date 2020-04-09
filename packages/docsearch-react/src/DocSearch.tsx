import React from 'react';
import {
  createAutocomplete,
  AutocompleteState,
  PublicAutocompleteOptions,
} from '@francoischalifour/autocomplete-core';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';

import { MAX_QUERY_SIZE } from './constants';
import {
  DocSearchHit,
  InternalDocSearchHit,
  StoredDocSearchHit,
} from './types';
import { createSearchClient, groupBy, noop } from './utils';
import { createStoredSearches } from './stored-searches';
import { SearchBox } from './SearchBox';
import { ScreenState } from './ScreenState';
import { Footer } from './Footer';

interface DocSearchProps
  extends Omit<
    PublicAutocompleteOptions<InternalDocSearchHit>,
    'onStateChange' | 'getSources'
  > {
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
  ...autocompleteProps
}: DocSearchProps) {
  const [state, setState] = React.useState<
    AutocompleteState<InternalDocSearchHit>
  >({
    query: '',
    suggestions: [],
  } as any);

  const searchBoxRef = React.useRef<HTMLDivElement | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const snipetLength = React.useRef<number>(10);
  const initialQuery = React.useRef(
    typeof window !== 'undefined'
      ? window
          .getSelection()!
          .toString()
          .slice(0, MAX_QUERY_SIZE)
      : ''
  ).current;

  const searchClient = React.useMemo(() => createSearchClient(appId, apiKey), [
    appId,
    apiKey,
  ]);
  const favoriteSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: '__DOCSEARCH_FAVORITE_SEARCHES__',
      limit: 10,
    })
  ).current;
  const recentSearches = React.useRef(
    createStoredSearches<StoredDocSearchHit>({
      key: '__DOCSEARCH_RECENT_SEARCHES__',
      // We display 7 recent searches and there's no favorites, but only
      // 4 when there are favorites.
      limit: favoriteSearches.getAll().length === 0 ? 7 : 4,
    })
  ).current;

  const saveRecentSearch = React.useCallback(
    function saveRecentSearch(item: StoredDocSearchHit) {
      // We save the recent search only if it's not favorited.
      if (
        favoriteSearches
          .getAll()
          .findIndex(search => search.objectID === item.objectID) === -1
      ) {
        recentSearches.add(item);
      }
    },
    [favoriteSearches, recentSearches]
  );

  const autocomplete = React.useMemo(
    () =>
      createAutocomplete<
        InternalDocSearchHit,
        React.FormEvent<HTMLFormElement>,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        defaultHighlightedIndex: 0,
        autoFocus: true,
        placeholder: 'Search docs',
        openOnFocus: true,
        initialState: {
          query: initialQuery,
        },
        ...autocompleteProps,
        onStateChange({ state }) {
          setState(state as any);
        },
        getSources({ query, state, setContext, setStatus }) {
          if (!query) {
            return [
              {
                onSelect({ suggestion }) {
                  saveRecentSearch(suggestion);
                  onClose();
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                getSuggestions() {
                  return recentSearches.getAll();
                },
              },
              {
                onSelect({ suggestion }) {
                  saveRecentSearch(suggestion);
                  onClose();
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                getSuggestions() {
                  return favoriteSearches.getAll();
                },
              },
            ];
          }

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
          })
            .catch(error => {
              // The Algolia `RetryError` happens when all the servers have
              // failed, meaning that there's no chance the response comes
              // back. This is the right time to display an error.
              // See https://github.com/algolia/algoliasearch-client-javascript/blob/2ffddf59bc765cd1b664ee0346b28f00229d6e12/packages/transporter/src/errors/createRetryError.ts#L5
              if (error.name === 'RetryError') {
                setStatus('error');
              }

              throw error;
            })
            .then((hits: DocSearchHit[]) => {
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

              // We store the `lvl0`s to display them as search suggestions
              // in the “no results“ screen.
              if (state.context.searchSuggestions === undefined) {
                setContext({
                  searchSuggestions: Object.keys(sources),
                });
              }

              return Object.values<DocSearchHit[]>(sources).map(items => {
                return {
                  onSelect({ suggestion }) {
                    saveRecentSearch(suggestion);
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
    [
      indexName,
      searchParameters,
      searchClient,
      onClose,
      recentSearches,
      favoriteSearches,
      saveRecentSearch,
      initialQuery,
    ]
  );

  const { getEnvironmentProps, getRootProps, refresh } = autocomplete;

  React.useEffect(() => {
    const isMobileMediaQuery = window.matchMedia('(max-width: 750px)');

    if (isMobileMediaQuery.matches) {
      snipetLength.current = 5;
    }
  }, []);

  React.useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [state.query]);

  // We don't focus the input when there's an initial query (i.e. Selection
  // Search) because users rather want to see the results directly, without the
  // keyboard appearing.
  // We therefore need to refresh the autocomplete instance to load all the
  // results, which is usually triggered on focus.
  React.useEffect(() => {
    if (initialQuery.length > 0) {
      refresh();
    }
  }, [initialQuery, refresh]);

  React.useEffect(() => {
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
            {...autocomplete}
            state={state}
            autoFocus={initialQuery.length === 0}
            onClose={onClose}
            inputRef={inputRef}
          />
        </header>

        <div className="DocSearch-Dropdown" ref={dropdownRef}>
          <ScreenState
            {...autocomplete}
            state={state}
            recentSearches={recentSearches}
            favoriteSearches={favoriteSearches}
            onItemClick={item => {
              saveRecentSearch(item);
              onClose();
            }}
            inputRef={inputRef}
          />
        </div>

        <footer className="DocSearch-Footer">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
