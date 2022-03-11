/** @jsx h */
import {
  createLocalStorageRecentSearchesPlugin,
  search,
} from '@algolia/autocomplete-plugin-recent-searches';
import { h } from 'preact';

import { setSmartPreview } from '../setSmartPreview';

export const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'autocomplete-two-column-layout-example',
  search(params) {
    const limit = params.query ? 1 : 4;
    return search({ ...params, limit });
  },
  transformSource({ source }) {
    return {
      ...source,
      onActive(params) {
        if (!params.state.query) {
          return;
        }

        setSmartPreview({
          preview: {
            query: params.item.label,
          },
          ...params,
        });
      },
    };
  },
});
