import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';
import React from 'react';

import { DocSearchProps } from './DocSearch';
import { ErrorScreen } from './ErrorScreen';
import { NoResultsScreen } from './NoResultsScreen';
import { ResultsScreen } from './ResultsScreen';
import { StartScreen } from './StartScreen';
import { StoredSearchPlugin } from './stored-searches';
import { InternalDocSearchHit, StoredDocSearchHit } from './types';

export interface ScreenStateProps<TItem>
  extends AutocompleteApi<
    TItem,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<TItem>;
  recentSearches: StoredSearchPlugin<StoredDocSearchHit>;
  favoriteSearches: StoredSearchPlugin<StoredDocSearchHit>;
  onItemClick(item: InternalDocSearchHit): void;
  inputRef: React.MutableRefObject<null | HTMLInputElement>;
  hitComponent: DocSearchProps['hitComponent'];
  indexName: DocSearchProps['indexName'];
  disableUserPersonalization: boolean;
  resultsFooterComponent: DocSearchProps['resultsFooterComponent'];
}

export const ScreenState = React.memo(
  (props: ScreenStateProps<InternalDocSearchHit>) => {
    if (props.state.status === 'error') {
      return <ErrorScreen />;
    }

    const hasSuggestions = props.state.suggestions.some(
      (suggestion) => suggestion.items.length > 0
    );

    if (!props.state.query) {
      return <StartScreen {...props} hasSuggestions={hasSuggestions} />;
    }

    if (hasSuggestions === false) {
      return <NoResultsScreen {...props} />;
    }

    return <ResultsScreen {...props} />;
  },
  function areEqual(_prevProps, nextProps) {
    // We don't update the screen when Autocomplete is loading or stalled to
    // avoid UI flashes:
    //  - Empty screen → Results screen
    //  - NoResults screen → NoResults screen with another query
    return (
      nextProps.state.status === 'loading' ||
      nextProps.state.status === 'stalled'
    );
  }
);
