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
    API: [
      {
        type: 'category',
        label: 'Autocomplete',
        items: ['createAutocomplete'],
      },
      {
        type: 'category',
        label: 'React',
        items: ['useAutocomplete'],
      },
      {
        type: 'category',
        label: 'Algolia Preset',
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
        label: 'DocSearch',
        items: ['DocSearch', 'DocSearchButton', 'DocSearchModal'],
      },
    ],
  },
};
