import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { StoredDocSearchHit } from './types';
import { StoredSearchPlugin } from './stored-searches';
import { Results } from './Results';
import { ResetIcon, RecentIcon, StarIcon } from './icons';

interface EmptyScreenProps
  extends AutocompleteApi<
    StoredDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<StoredDocSearchHit>;
  hasSuggestions: boolean;
  onItemClick(item: StoredDocSearchHit): void;
  recentSearches: StoredSearchPlugin<StoredDocSearchHit>;
  favoriteSearches: StoredSearchPlugin<StoredDocSearchHit>;
}

export function EmptyScreen(props: EmptyScreenProps) {
  if (props.state.status === 'idle' && props.hasSuggestions === false) {
    return (
      <div className="DocSearch-EmptyScreen">
        <p className="DocSearch-Help">Your search history will appear here.</p>
      </div>
    );
  }

  if (props.hasSuggestions === false) {
    return null;
  }

  return (
    <div className="DocSearch-Dropdown-Container">
      <Results
        {...props}
        title="Recent"
        suggestion={props.state.suggestions[0]}
        renderIcon={() => (
          <div className="DocSearch-Hit-icon">
            <RecentIcon />
          </div>
        )}
        renderAction={({ item }) => (
          <>
            <div className="DocSearch-Hit-action">
              <button
                className="DocSearch-Hit-action-button"
                title="Save this search"
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  props.favoriteSearches.add(item);
                  props.refresh();
                }}
              >
                <StarIcon />
              </button>
            </div>
            <div className="DocSearch-Hit-action">
              <button
                className="DocSearch-Hit-action-button"
                title="Remove this search from history"
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();
                  props.recentSearches.remove(item);
                  props.refresh();
                }}
              >
                <ResetIcon />
              </button>
            </div>
          </>
        )}
      />

      <Results
        {...props}
        title="Favorites"
        suggestion={props.state.suggestions[1]}
        renderIcon={() => (
          <div className="DocSearch-Hit-icon">
            <StarIcon />
          </div>
        )}
        renderAction={({ item }) => (
          <button
            className="DocSearch-Hit-action-button"
            title="Remove this search from favorite"
            onClick={event => {
              event.preventDefault();
              event.stopPropagation();
              props.favoriteSearches.remove(item);
              props.refresh();
            }}
          >
            <ResetIcon />
          </button>
        )}
      />
    </div>
  );
}
