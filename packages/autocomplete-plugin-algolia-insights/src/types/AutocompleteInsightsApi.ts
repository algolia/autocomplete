import { createSearchInsightsApi } from '../createSearchInsightsApi';

export type AutocompleteInsightsApi = ReturnType<
  typeof createSearchInsightsApi
>;

export type ClickedObjectIDsAfterSearchParams = {
  eventName: string;
  index: string;
  objectIDs: string[];
  positions: number[];
  queryID: string;
  userToken?: string;
};

export type ClickedObjectIDsParams = {
  eventName: string;
  index: string;
  objectIDs: string[];
  userToken?: string;
};

export type ClickedFiltersParams = {
  eventName: string;
  filters: string[];
  index: string;
  userToken: string;
};

export type ConvertedObjectIDsAfterSearchParams = {
  eventName: string;
  index: string;
  objectIDs: string[];
  queryID: string;
  userToken?: string;
};

export type ConvertedObjectIDsParams = {
  eventName: string;
  index: string;
  objectIDs: string[];
  userToken: string;
};

export type ConvertedFiltersParams = {
  eventName: string;
  filters: string[];
  index: string;
  userToken: string;
};

export type ViewedObjectIDsParams = {
  eventName: string;
  index: string;
  objectIDs: string[];
  userToken?: string;
};

export type ViewedFiltersParams = {
  eventName: string;
  filters: string[];
  index: string;
  userToken: string;
};
