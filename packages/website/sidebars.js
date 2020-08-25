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
        label: 'Core',
        items: ['createAutocomplete'],
      },
      {
        type: 'category',
        label: 'JavaScript',
        items: [
          'autocomplete-js',
          { type: 'link', label: 'getAlgoliaHits', href: 'getAlgoliaHits' },
          {
            type: 'link',
            label: 'getAlgoliaResults',
            href: 'getAlgoliaResults',
          },
        ],
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
