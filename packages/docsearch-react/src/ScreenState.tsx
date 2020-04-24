import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { StoredSearchPlugin } from './stored-searches';
import { InternalDocSearchHit, StoredDocSearchHit } from './types';
import { StartScreen } from './StartScreen';
import { ResultsScreen } from './ResultsScreen';
import { NoResultsScreen } from './NoResultsScreen';
import { ErrorScreen } from './ErrorScreen';

interface ScreenStateProps<TItem>
  extends AutocompleteApi<
    TItem,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<TItem>;
  recentSearches: StoredSearchPlugin<StoredDocSearchHit>;
  favoriteSearches: StoredSearchPlugin<StoredDocSearchHit>;
  onItemClick(item: StoredDocSearchHit): void;
  inputRef: React.MutableRefObject<null | HTMLInputElement>;
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
      return (
        <StartScreen
          {...(props as ScreenStateProps<any>)}
          hasSuggestions={hasSuggestions}
        />
      );
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
