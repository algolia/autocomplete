/* eslint-disable import/no-commonjs */

module.exports = {
  docs: {
    'The Basics': [
      'getting-started',
      'installation',
      'state',
      'context',
      'sources',
      'keyboard-navigation',
      'layout',
      'prop-getters',
      'controlled-mode',
      'more-resources',
    ],
    Workflow: ['debugging', 'upgrading'],
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
        items: [
          'autocomplete-js',
          'getAlgoliaHits-js',
          'getAlgoliaResults-js',
          'highlightHit',
          'reverseHighlightHit',
          'snippetHit',
          'reverseSnippetHit',
        ],
      },
      {
        type: 'category',
        label: 'autocomplete-preset-algolia',
        items: [
          'getAlgoliaHits',
          'getAlgoliaResults',
          'parseAlgoliaHitHighlight',
          'parseAlgoliaHitReverseHighlight',
          'parseAlgoliaHitSnippet',
          'parseAlgoliaHitReverseSnippet',
        ],
      },
    ],
  },
};
