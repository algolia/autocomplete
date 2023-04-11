import type { InsightsMethodMap } from 'search-insights';

import { isModernInsightsClient } from './isModernInsightsClient';
import {
  AlgoliaInsightsHit,
  ClickedFiltersParams,
  ClickedObjectIDsAfterSearchParams,
  ClickedObjectIDsParams,
  ConvertedFiltersParams,
  ConvertedObjectIDsAfterSearchParams,
  ConvertedObjectIDsParams,
  InsightsClient,
  InsightsClientMethod,
  InsightsParamsWithItems,
  ViewedFiltersParams,
  ViewedObjectIDsParams,
} from './types';

function chunk<TItem extends { objectIDs: string[] }>(
  item: TItem,
  chunkSize: number = 20
): TItem[] {
  const chunks: TItem[] = [];
  for (let i = 0; i < item.objectIDs.length; i += chunkSize) {
    chunks.push({
      ...item,
      objectIDs: item.objectIDs.slice(i, i + chunkSize),
    });
  }
  return chunks;
}

function mapToInsightsParamsApi<
  TInsightsParamsType extends {
    items: AlgoliaInsightsHit[];
    objectIDs?: string[];
  }
>(params: TInsightsParamsType[]) {
  return params.map(({ items, ...param }) => ({
    ...param,
    objectIDs: items?.map(({ objectID }) => objectID) || param.objectIDs,
  }));
}

export function createSearchInsightsApi(searchInsights: InsightsClient) {
  const canSendHeaders = isModernInsightsClient(searchInsights);

  function sendToInsights<TInsightsMethod extends InsightsClientMethod>(
    method: InsightsClientMethod,
    payloads: InsightsMethodMap[TInsightsMethod],
    items?: AlgoliaInsightsHit[]
  ) {
    if (canSendHeaders && typeof items !== 'undefined') {
      const { appId, apiKey } = items[0].__autocomplete_algoliaCredentials;
      const headers = {
        'X-Algolia-Application-Id': appId,
        'X-Algolia-API-Key': apiKey,
      };

      searchInsights(method, ...payloads, { headers } as any);
    } else {
      searchInsights(method, ...payloads);
    }
  }

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
      ...params: Array<
        InsightsParamsWithItems<ClickedObjectIDsAfterSearchParams>
      >
    ) {
      if (params.length > 0) {
        sendToInsights(
          'clickedObjectIDsAfterSearch',
          mapToInsightsParamsApi(params),
          params[0].items
        );
      }
    },
    /**
     * Sends click events to capture clicked items.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/clicked-object-ids/
     */
    clickedObjectIDs(
      ...params: Array<InsightsParamsWithItems<ClickedObjectIDsParams>>
    ) {
      if (params.length > 0) {
        sendToInsights(
          'clickedObjectIDs',
          mapToInsightsParamsApi(params),
          params[0].items
        );
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
      ...params: Array<
        InsightsParamsWithItems<ConvertedObjectIDsAfterSearchParams>
      >
    ) {
      if (params.length > 0) {
        sendToInsights(
          'convertedObjectIDsAfterSearch',
          mapToInsightsParamsApi(params),
          params[0].items
        );
      }
    },
    /**
     * Sends conversion events to capture clicked items.
     *
     * @link https://www.algolia.com/doc/api-reference/api-methods/converted-object-ids/
     */
    convertedObjectIDs(
      ...params: Array<InsightsParamsWithItems<ConvertedObjectIDsParams>>
    ) {
      if (params.length > 0) {
        sendToInsights(
          'convertedObjectIDs',
          mapToInsightsParamsApi(params),
          params[0].items
        );
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
    viewedObjectIDs(
      ...params: Array<InsightsParamsWithItems<ViewedObjectIDsParams>>
    ) {
      if (params.length > 0) {
        params
          .map((param) => ({
            ...param,
            objectIDs:
              param.items?.map(({ objectID }) => objectID) || param.objectIDs,
          }))
          .reduce(
            (acc, { items, ...param }) => [
              ...acc,
              ...chunk<ViewedObjectIDsParams>(param).map((payload) => {
                return { items, payload };
              }),
            ],
            [] as Array<{
              items?: AlgoliaInsightsHit[];
              payload: ViewedObjectIDsParams;
            }>
          )
          .forEach(({ items, payload }) =>
            sendToInsights('viewedObjectIDs', [payload], items)
          );
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
