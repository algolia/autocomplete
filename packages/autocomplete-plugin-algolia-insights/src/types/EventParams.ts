import { AutocompleteState } from '@algolia/autocomplete-shared';

import {
  ClickedObjectIDsAfterSearchParams,
  ViewedObjectIDsParams,
} from './AutocompleteInsightsApi';

import { AlgoliaInsightsHit, AutocompleteInsightsApi } from '.';

export type OnSelectParams = {
  insights: AutocompleteInsightsApi;
  insightsEvents: Array<
    ClickedObjectIDsAfterSearchParams & { algoliaSource?: string[] }
  >;
  item: AlgoliaInsightsHit;
  state: AutocompleteState<any>;
  event: any;
};

export type OnActiveParams = OnSelectParams;

export type OnItemsChangeParams = {
  insights: AutocompleteInsightsApi;
  insightsEvents: Array<ViewedObjectIDsParams & { algoliaSource?: string[] }>;
  state: AutocompleteState<any>;
};
