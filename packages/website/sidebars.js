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
      'plugins',
      'detached-mode',
    ],
    Guides: [
      'adding-suggested-searches',
      'adding-recent-searches',
      'including-multiple-result-types',
      'changing-behavior-based-on-query',
      'sending-algolia-insights-events',
      'using-react',
      'using-vue',
      'creating-a-renderer',
      'upgrading',
      'debugging',
    ],
    'API Reference': [
      'api',
      {
        type: 'category',
        label: 'autocomplete-js',
        items: [
          'autocomplete-js',
          'getAlgoliaHits-js',
          'getAlgoliaResults-js',
          'getAlgoliaFacetHits-js',
        ],
      },
      {
        type: 'category',
        label: 'autocomplete-core',
        items: ['createAutocomplete'],
      },
      {
        type: 'category',
        label: 'autocomplete-plugin-recent-searches',
        items: [
          'createRecentSearchesPlugin',
          'createLocalStorageRecentSearchesPlugin',
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
          'getAlgoliaFacetHits',
          'parseAlgoliaHitHighlight',
          'parseAlgoliaHitSnippet',
          'parseAlgoliaHitReverseHighlight',
          'parseAlgoliaHitReverseSnippet',
        ],
      },
      'autocomplete-theme-classic',
      'autocomplete-layout-classic',
    ],
  },
};
