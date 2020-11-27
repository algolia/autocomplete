import { AutocompleteState } from '@algolia/autocomplete-core';

import {
  ClickedObjectIDsAfterSearchParams,
  ViewedObjectIDsParams,
} from './InsightsApi';

import { AlgoliaInsightsHit, InsightsApi } from '.';

export type OnSelectParams = {
  insights: InsightsApi;
  insightsEvents: ClickedObjectIDsAfterSearchParams[];
  item: AlgoliaInsightsHit;
  state: AutocompleteState<any>;
  event: any;
};

export type OnHighlightParams = OnSelectParams;

export type OnItemsChangeParams = {
  insights: InsightsApi;
  insightsEvents: ViewedObjectIDsParams[];
  state: AutocompleteState<any>;
};
