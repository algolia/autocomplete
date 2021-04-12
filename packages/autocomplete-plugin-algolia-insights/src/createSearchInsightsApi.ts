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
    /**
     * Initializes Insights with Algolia credentials.
     */
    init(appId: string, apiKey: string) {
      searchInsights('init', { appId, apiKey });
    },
    /**
     * Sets the user token to attach to events.
     */
    setUserToken(userToken: string) {
      searchInsights('setUserToken', userToken);
    },
    /**
     * Sends click events to capture a query and its clicked items and positions.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids-after-search/
     */
    clickedObjectIDsAfterSearch(
      ...params: ClickedObjectIDsAfterSearchParams[]
    ) {
      if (params.length > 0) {
        searchInsights('clickedObjectIDsAfterSearch', ...params);
      }
    },
    /**
     * Sends click events to capture clicked items.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids/
     */
    clickedObjectIDs(...params: ClickedObjectIDsParams[]) {
      if (params.length > 0) {
        searchInsights('clickedObjectIDs', ...params);
      }
    },
    /**
     * Sends click events to capture the filters a user clicks on.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/clicked-filters/
     */
    clickedFilters(...params: ClickedFiltersParams[]) {
      if (params.length > 0) {
        searchInsights('clickedFilters', ...params);
      }
    },
    /**
     * Sends conversion events to capture a query and its clicked items.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/converted-object-ids-after-search/
     */
    convertedObjectIDsAfterSearch(
      ...params: ConvertedObjectIDsAfterSearchParams[]
    ) {
      if (params.length > 0) {
        searchInsights('convertedObjectIDsAfterSearch', ...params);
      }
    },
    /**
     * Sends conversion events to capture clicked items.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/converted-object-ids/
     */
    convertedObjectIDs(...params: ConvertedObjectIDsParams[]) {
      if (params.length > 0) {
        searchInsights('convertedObjectIDs', ...params);
      }
    },
    /**
     * Sends conversion events to capture the filters a user uses when converting.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/converted-filters/
     */
    convertedFilters(...params: ConvertedFiltersParams[]) {
      if (params.length > 0) {
        searchInsights('convertedFilters', ...params);
      }
    },
    /**
     * Sends view events to capture clicked items.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/viewed-object-ids/
     */
    viewedObjectIDs(...params: ViewedObjectIDsParams[]) {
      if (params.length > 0) {
        searchInsights('viewedObjectIDs', ...params);
      }
    },
    /**
     * Sends view events to capture the filters a user uses when viewing.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/viewed-filters/
     */
    viewedFilters(...params: ViewedFiltersParams[]) {
      if (params.length > 0) {
        searchInsights('viewedFilters', ...params);
      }
    },
  };
}
