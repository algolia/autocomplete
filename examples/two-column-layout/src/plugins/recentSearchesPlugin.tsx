/** @jsx h */
import {
  createLocalStorageRecentSearchesPlugin,
  search,
} from '@algolia/autocomplete-plugin-recent-searches';
import { h } from 'preact';

export const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'autocomplete-two-column-layout-example',
  search(params) {
    const limit = params.query ? 1 : 4;
    return search({ ...params, limit });
  },
  transformSource({ source }) {
    return {
      ...source,
      templates: {
        ...source.templates,
        header({ state, Fragment }) {
          return (
            <Fragment>
              <span className="aa-SourceHeaderTitle">
                {state.query ? 'Suggestions' : 'Recent searches'}
              </span>
              <div className="aa-SourceHeaderLine" />
            </Fragment>
          );
        },
      },
    };
  },
});
