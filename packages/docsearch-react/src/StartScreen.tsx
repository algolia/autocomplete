import React from 'react';
import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';

import { StoredDocSearchHit } from './types';
import { StoredSearchPlugin } from './stored-searches';
import { Results } from './Results';
import { ResetIcon, RecentIcon, StarIcon } from './icons';

interface StartScreenProps
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
  disableUserPersonalization: boolean;
}

export function StartScreen(props: StartScreenProps) {
  if (props.state.status === 'idle' && props.hasSuggestions === false) {
    if (props.disableUserPersonalization) {
      return null;
    }

    return (
      <div className="DocSearch-StartScreen">
        <p className="DocSearch-Help">No recent searches</p>
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
        renderAction={({
          item,
          runFavoriteTransition,
          runDeleteTransition,
        }) => (
          <>
            <div className="DocSearch-Hit-action">
              <button
                data-cy="fav-recent"
                className="DocSearch-Hit-action-button"
                title="Save this search"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  runFavoriteTransition(() => {
                    props.favoriteSearches.add(item);
                    props.recentSearches.remove(item);
                    props.refresh();
                  });
                }}
              >
                <StarIcon />
              </button>
            </div>
            <div className="DocSearch-Hit-action">
              <button
                data-cy="remove-recent"
                className="DocSearch-Hit-action-button"
                title="Remove this search from history"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  runDeleteTransition(() => {
                    props.recentSearches.remove(item);
                    props.refresh();
                  });
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
        renderAction={({ item, runDeleteTransition }) => (
          <div className="DocSearch-Hit-action">
            <button
              data-cy="remove-fav"
              className="DocSearch-Hit-action-button"
              title="Remove this search from favorites"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                runDeleteTransition(() => {
                  props.favoriteSearches.remove(item);
                  props.refresh();
                });
              }}
            >
              <ResetIcon />
            </button>
          </div>
        )}
      />
    </div>
  );
}
