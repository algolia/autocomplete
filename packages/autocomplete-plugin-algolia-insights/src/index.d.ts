import { AutocompleteInsightsApi } from './types';

declare module '@algolia/autocomplete-core' {
  export interface AutocompleteContext {
    algoliaInsightsPlugin: {
      insights: AutocompleteInsightsApi;
    };
  }
}
