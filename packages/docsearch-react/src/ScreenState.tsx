import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { StoredSearchPlugin } from './stored-searches';
import { InternalDocSearchHit, StoredDocSearchHit } from './types';
import { EmptyScreen } from './EmptyScreen';
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

export function ScreenState(props: ScreenStateProps<InternalDocSearchHit>) {
  if (props.state.status === 'error') {
    return <ErrorScreen />;
  }

  const hasSuggestions = props.state.suggestions.some(
    suggestion => suggestion.items.length > 0
  );

  if (!props.state.query) {
    return (
      <EmptyScreen
        {...(props as ScreenStateProps<any>)}
        hasSuggestions={hasSuggestions}
      />
    );
  }

  if (props.state.status === 'idle' && hasSuggestions === false) {
    return <NoResultsScreen {...props} />;
  }

  return <ResultsScreen {...props} />;
}
