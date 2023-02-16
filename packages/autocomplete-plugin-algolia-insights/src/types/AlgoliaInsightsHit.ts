export type AlgoliaInsightsHit = {
  objectID: string;
  __autocomplete_indexName: string;
  __autocomplete_queryID: string;
  // FIXME: Should be owned by autocomplete-preset-algolia
  __autocomplete_algoliaResultsMetadata: {
    appId: string;
    apiKey: string;
  };
};
