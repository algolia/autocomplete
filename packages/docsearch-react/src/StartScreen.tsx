import React from 'react';

import { RecentIcon, ResetIcon, StarIcon } from './icons';
import { Results } from './Results';
import { ScreenStateProps } from './ScreenState';
import { InternalDocSearchHit } from './types';

interface StartScreenProps extends ScreenStateProps<InternalDocSearchHit> {
  hasSuggestions: boolean;
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
