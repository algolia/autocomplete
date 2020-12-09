import { InsightsApi } from './types';

declare module '@algolia/autocomplete-core' {
  export interface AutocompleteContext {
    algoliaInsightsPlugin: {
      insights: InsightsApi;
    };
  }
}
