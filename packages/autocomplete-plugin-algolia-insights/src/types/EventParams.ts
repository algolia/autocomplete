import {
  ClickedObjectIDsAfterSearchParams,
  ViewedObjectIDsParams,
} from './AutocompleteInsightsApi';
import { AutocompleteState } from './FakeAutocompleteJsTypes';

import { AlgoliaInsightsHit, AutocompleteInsightsApi } from '.';

export type OnSelectParams = {
  insights: AutocompleteInsightsApi;
  insightsEvents: ClickedObjectIDsAfterSearchParams[];
  item: AlgoliaInsightsHit;
  state: AutocompleteState<any>;
  event: any;
};

export type OnActiveParams = OnSelectParams;

export type OnItemsChangeParams = {
  insights: AutocompleteInsightsApi;
  insightsEvents: ViewedObjectIDsParams[];
  state: AutocompleteState<any>;
};
