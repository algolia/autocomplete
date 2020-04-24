import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit } from './types';

import { NoResultsIcon } from './icons';

interface NoResultsScreenProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  inputRef: React.MutableRefObject<null | HTMLInputElement>;
}

export function NoResultsScreen(props: NoResultsScreenProps) {
  const searchSuggestions: string[] | undefined =
    props.state.context.searchSuggestions;

  return (
    <div className="DocSearch-NoResults">
      <div className="DocSearch-Screen-Icon">
        <NoResultsIcon />
      </div>
      <p className="DocSearch-Title">
        No results for "<strong>{props.state.query}</strong>"
      </p>

      {searchSuggestions && searchSuggestions.length > 0 && (
        <div className="DocSearch-NoResults-Prefill-List">
          <p className="DocSearch-Help">Try searching for:</p>
          <ul>
            {searchSuggestions.slice(0, 3).reduce<React.ReactNode[]>(
              (acc, search) => [
                ...acc,
                <li>
                  <button
                    className="DocSearch-Prefill"
                    key={search}
                    onClick={() => {
                      props.setQuery(search.toLowerCase() + ' ');
                      props.refresh();
                      props.inputRef.current!.focus();
                    }}
                  >
                    {search}
                  </button>
                </li>,
              ],
              []
            )}
          </ul>
        </div>
      )}

      <p className="DocSearch-Help">
        You believe this query should return results?{' '}
        <a
          href="https://github.com/algolia/docsearch-configs/issues/new?template=Missing_results.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Let us know
        </a>
        .
      </p>
    </div>
  );
}
