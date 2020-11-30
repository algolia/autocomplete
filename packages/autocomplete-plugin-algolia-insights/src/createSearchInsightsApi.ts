import {
  ClickedFiltersParams,
  ClickedObjectIDsAfterSearchParams,
  ClickedObjectIDsParams,
  ConvertedFiltersParams,
  ConvertedObjectIDsAfterSearchParams,
  ConvertedObjectIDsParams,
  InsightsClient,
  ViewedFiltersParams,
  ViewedObjectIDsParams,
} from './types';

export function createSearchInsightsApi(searchInsights: InsightsClient) {
  return {
    init(appId: string, apiKey: string) {
      searchInsights('init', { appId, apiKey });
    },
    setUserToken(userToken: string) {
      searchInsights('setUserToken', userToken);
    },
    clickedObjectIDsAfterSearch(
      ...params: ClickedObjectIDsAfterSearchParams[]
    ) {
      if (params.length > 0) {
        searchInsights('clickedObjectIDsAfterSearch', ...params);
      }
    },
    clickedObjectIDs(...params: ClickedObjectIDsParams[]) {
      if (params.length > 0) {
        searchInsights('clickedObjectIDs', ...params);
      }
    },
    clickedFilters(...params: ClickedFiltersParams[]) {
      if (params.length > 0) {
        searchInsights('clickedFilters', ...params);
      }
    },
    convertedObjectIDsAfterSearch(
      ...params: ConvertedObjectIDsAfterSearchParams[]
    ) {
      if (params.length > 0) {
        searchInsights('convertedObjectIDsAfterSearch', ...params);
      }
    },
    convertedObjectIDs(...params: ConvertedObjectIDsParams[]) {
      if (params.length > 0) {
        searchInsights('convertedObjectIDs', ...params);
      }
    },
    convertedFilters(...params: ConvertedFiltersParams[]) {
      if (params.length > 0) {
        searchInsights('convertedFilters', ...params);
      }
    },
    viewedObjectIDs(...params: ViewedObjectIDsParams[]) {
      if (params.length > 0) {
        searchInsights('viewedObjectIDs', ...params);
      }
    },
    viewedFilters(...params: ViewedFiltersParams[]) {
      if (params.length > 0) {
        searchInsights('viewedFilters', ...params);
      }
    },
  };
}
