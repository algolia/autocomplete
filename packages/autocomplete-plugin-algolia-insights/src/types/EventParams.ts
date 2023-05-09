import type { AutocompleteState } from '@algolia/autocomplete-shared';

import type {
  ClickedObjectIDsAfterSearchParams,
  InsightsParamsWithItems,
  ViewedObjectIDsParams,
} from './AutocompleteInsightsApi';

import type { AlgoliaInsightsHit, AutocompleteInsightsApi } from '.';

export type OnSelectParams = {
  insights: AutocompleteInsightsApi;
  insightsEvents: Array<
    InsightsParamsWithItems<
      ClickedObjectIDsAfterSearchParams & {
        algoliaSource?: string[];
      }
    >
  >;
  item: AlgoliaInsightsHit;
  state: AutocompleteState<any>;
  event: any;
};

export type OnActiveParams = OnSelectParams;

export type OnItemsChangeParams = {
  insights: AutocompleteInsightsApi;
  insightsEvents: Array<
    InsightsParamsWithItems<
      ViewedObjectIDsParams & { algoliaSource?: string[] }
    >
  >;
  state: AutocompleteState<any>;
};
