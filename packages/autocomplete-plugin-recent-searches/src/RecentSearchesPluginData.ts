export type RecentSearchesPluginData = {
  getQuerySuggestionsFacetFilters(): string[][];
  getQuerySuggestionsHitsPerPage(hitsPerPage: number): number;
};
