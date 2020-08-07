import React from 'react';

import { NoResultsIcon } from './icons';
import { ScreenStateProps } from './ScreenState';
import { InternalDocSearchHit } from './types';

type NoResultsScreenProps = ScreenStateProps<InternalDocSearchHit>;

export function NoResultsScreen(props: NoResultsScreenProps) {
  const searchSuggestions: string[] | undefined = props.state.context
    .searchSuggestions as string[];

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
                <li key={search}>
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
        Believe this query should return results?{' '}
        <a
          href={`https://github.com/algolia/docsearch-configs/issues/new?template=Missing_results.md&title=[${props.indexName}]+Missing+results+for+query+"${props.state.query}"`}
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
