/* eslint-disable import/no-commonjs */

module.exports = {
  docs: {
    Introduction: ['introduction', 'getting-started', 'help'],
    'Core Concepts': [
      'basic-options',
      'sources',
      'templates',
      'state',
      'context',
      'keyboard-navigation',
      // 'prop-getters',
      'plugins',
    ],
    Guides: [
      'adding-suggested-searches',
      'adding-recent-searches',
      'including-multiple-result-types',
      'changing-behavior-based-on-query',
      'sending-algolia-insights-events',
      'using-vue',
      'creating-a-renderer',
      'upgrading',
      'debugging',
    ],
    'API Reference': [
      'api',
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
      {
        type: 'category',
        label: 'autocomplete-plugin-recent-searches',
        items: [
          'createLocalStorageRecentSearchesPlugin',
          'createRecentSearchesPlugin',
        ],
      },
      {
        type: 'category',
        label: 'autocomplete-plugin-query-suggestions',
        items: ['createQuerySuggestionsPlugin'],
      },
      {
        type: 'category',
        label: 'autocomplete-plugin-algolia-insights',
        items: ['createAlgoliaInsightsPlugin'],
      },
    ],
  },
};
