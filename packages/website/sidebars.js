/* eslint-disable import/no-commonjs */

module.exports = {
  docs: {
    'The Basics': [
      'getting-started',
      'state',
      'context',
      'sources',
      'keyboard-navigation',
      'layout',
      'prop-getters',
      'controlled-mode',
      'more-resources',
    ],
    Guides: ['creating-a-renderer'],
    API: [
      {
        type: 'category',
        label: 'autocomplete-core',
        items: ['createAutocomplete'],
      },
      {
        type: 'category',
        label: 'autocomplete-js',
        items: ['autocomplete-js', 'getAlgoliaHits-js', 'getAlgoliaResults-js'],
      },
      {
        type: 'category',
        label: 'autocomplete-react',
        items: ['useAutocomplete'],
      },
      {
        type: 'category',
        label: 'autocomplete-preset-algolia',
        items: [
          'highlightAlgoliaHit',
          'reverseHighlightAlgoliaHit',
          'snippetAlgoliaHit',
          'getAlgoliaHits',
          'getAlgoliaResults',
        ],
      },
      {
        type: 'category',
        label: 'docsearch-react',
        items: [
          'DocSearch',
          'DocSearchButton',
          'DocSearchModal',
          'performance-optimization',
        ],
      },
      {
        type: 'category',
        label: 'docsearch-js',
        items: ['docsearch-js'],
      },
      {
        type: 'category',
        label: 'docsearch-css',
        items: ['docsearch-css'],
      },
    ],
  },
};
