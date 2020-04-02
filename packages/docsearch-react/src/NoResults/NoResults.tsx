import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { InternalDocSearchHit } from '../types';

interface NoResultsProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  inputRef: React.MutableRefObject<null | HTMLInputElement>;
}

export function NoResults(props: NoResultsProps) {
  return (
    <div className="DocSearch-NoResults">
      <p className="Docsearch-Hit-title">
        No results for “{props.state.query}“.
      </p>

      <p>
        Try searching for{' '}
        {(props.state.context.searchSuggestions as string[])
          .slice(0, 3)
          .reduce<React.ReactNode[]>(
            (acc, search) => [
              ...acc,
              acc.length > 0 ? ', ' : '',
              '“',
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
              '“',
            ],
            []
          )}
        .
      </p>

      <p className="DocSearch-Label">
        If you believe this query should return results, please{' '}
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
