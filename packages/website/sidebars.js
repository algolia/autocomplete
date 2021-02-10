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
      'using-query-suggestions-plugin',
      'using-recent-searches-plugin',
      'using-algolia-insights-plugin',
      'creating-multi-source-autocompletes',
      'using-dynamic-sources-based-on-query',
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
      'autocomplete-theme-classic',
    ],
  },
};
