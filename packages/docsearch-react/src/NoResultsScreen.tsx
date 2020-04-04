import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit } from './types';

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
  const searchSuggestions: string[] = props.state.context.searchSuggestions;

  return (
    <div className="DocSearch-NoResults">
      <p className="DocSearch-Title">
        No results for "<strong>{props.state.query}</strong>".
      </p>

      {searchSuggestions.length > 0 && (
        <p>
          Try searching for{' '}
          {searchSuggestions.slice(0, 3).reduce<React.ReactNode[]>(
            (acc, search) => [
              ...acc,
              acc.length > 0 ? ', ' : '',
              <button
                className="DocSearch-Link"
                key={search}
                onClick={() => {
                  props.setQuery(search.toLowerCase() + ' ');
                  props.refresh();
                  props.inputRef.current!.focus();
                }}
              >
                {search}
              </button>,
            ],
            []
          )}
          &nbsp;...
        </p>
      )}

      <p className="DocSearch-Help">
        If you believe this query should return results,
        <br />
        please{' '}
        <a
          href="https://github.com/algolia/docsearch-configs/issues/new?template=Missing_results.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          let us know on GitHub
        </a>
        .
      </p>
    </div>
  );
}
