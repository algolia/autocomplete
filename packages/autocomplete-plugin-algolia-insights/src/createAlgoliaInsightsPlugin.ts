import {
  AutocompleteState,
  AutocompletePlugin,
  createRef,
  debounce,
  isEqual,
  noop,
  safelyRunOnBrowser,
} from '@algolia/autocomplete-shared';
import { AutocompleteReshapeSource } from '@algolia/autocomplete-shared/dist/esm/core';

import { createClickedEvent } from './createClickedEvent';
import { createSearchInsightsApi } from './createSearchInsightsApi';
import { createViewedEvents } from './createViewedEvents';
import { isAlgoliaInsightsHit } from './isAlgoliaInsightsHit';
import {
  AlgoliaInsightsHit,
  AutocompleteInsightsApi,
  InsightsClient,
  OnActiveParams,
  OnItemsChangeParams,
  OnSelectParams,
} from './types';

const VIEW_EVENT_DELAY = 400;
const ALGOLIA_INSIGHTS_VERSION = '2.6.0';
const ALGOLIA_INSIGHTS_SRC = `https://cdn.jsdelivr.net/npm/search-insights@${ALGOLIA_INSIGHTS_VERSION}/dist/search-insights.min.js`;

type SendViewedObjectIDsParams = {
  onItemsChange(params: OnItemsChangeParams): void;
  items: AlgoliaInsightsHit[];
  insights: AutocompleteInsightsApi;
  state: AutocompleteState<any>;
};

const sendViewedObjectIDs = debounce<SendViewedObjectIDsParams>(
  ({ onItemsChange, items, insights, state }) => {
    onItemsChange({
      insights,
      insightsEvents: createViewedEvents({ items }).map((event) => ({
        eventName: 'Items Viewed',
        ...event,
      })),
      state,
    });
  },
  VIEW_EVENT_DELAY
);

export type CreateAlgoliaInsightsPluginParams = {
  /**
   * The initialized Search Insights client.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-algolia-insights/createAlgoliaInsightsPlugin/#param-insightsclient
   */
  insightsClient?: InsightsClient;
  /**
   * Hook to send an Insights event when the items change.
   *
   * By default, it sends a `viewedObjectIDs` event.
   *
   * In as-you-type experiences, items change as the user types. This hook is debounced every 400ms to reflect actual items that users notice and avoid generating too many events for items matching "in progress" queries.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-algolia-insights/createAlgoliaInsightsPlugin/#param-onitemschange
   */
  onItemsChange?(params: OnItemsChangeParams): void;
  /**
   * Hook to send an Insights event when an item is selected.
   *
   * By default, it sends a clickedObjectIDsAfterSearch event.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-algolia-insights/createAlgoliaInsightsPlugin/#param-onselect
   */
  onSelect?(params: OnSelectParams): void;
  /**
   * Hook to send an Insights event when an item is active.
   *
   * By default, it doesn't send any events.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-algolia-insights/createAlgoliaInsightsPlugin/#param-onactive
   */
  onActive?(params: OnActiveParams): void;
  /**
   * @internal
   */
  __autocomplete_clickAnalytics?: boolean;
};

export function createAlgoliaInsightsPlugin(
  options: CreateAlgoliaInsightsPluginParams
): AutocompletePlugin<any, undefined> {
  const {
    insightsClient: providedInsightsClient,
    onItemsChange,
    onSelect: onSelectEvent,
    onActive: onActiveEvent,
    __autocomplete_clickAnalytics,
  } = getOptions(options);
  let insightsClient = providedInsightsClient as InsightsClient;

  if (!providedInsightsClient) {
    safelyRunOnBrowser(({ window }) => {
      const pointer = window.AlgoliaAnalyticsObject || 'aa';

      if (typeof pointer === 'string') {
        insightsClient = window[pointer];
      }

      if (!insightsClient) {
        window.AlgoliaAnalyticsObject = pointer;

        if (!window[pointer]) {
          window[pointer] = (...args: any[]) => {
            if (!window[pointer].queue) {
              window[pointer].queue = [];
            }

            window[pointer].queue.push(args);
          };
        }

        window[pointer].version = ALGOLIA_INSIGHTS_VERSION;

        insightsClient = window[pointer];

        loadInsights(window);
      }
    });
  }

  const insights = createSearchInsightsApi(insightsClient);
  const previousItems = createRef<AlgoliaInsightsHit[]>([]);

  const debouncedOnStateChange = debounce<{
    state: AutocompleteState<any>;
  }>(({ state }) => {
    if (!state.isOpen) {
      return;
    }

    const items = state.collections
      .reduce<unknown[]>((acc, current) => {
        return [...acc, ...current.items];
      }, [])
      .filter(isAlgoliaInsightsHit);

    if (
      !isEqual(
        previousItems.current.map((x) => x.objectID),
        items.map((x) => x.objectID)
      )
    ) {
      previousItems.current = items;

      if (items.length > 0) {
        sendViewedObjectIDs({ onItemsChange, items, insights, state });
      }
    }
  }, 0);

  return {
    name: 'aa.algoliaInsightsPlugin',
    subscribe({ setContext, onSelect, onActive }) {
      function setInsightsContext(userToken?: string) {
        setContext({
          algoliaInsightsPlugin: {
            __algoliaSearchParameters: {
              clickAnalytics: __autocomplete_clickAnalytics,
              ...(userToken ? { userToken } : {}),
            },
            insights,
          },
        });
      }

      insightsClient('addAlgoliaAgent', 'insights-plugin');

      setInsightsContext();
      insightsClient('onUserTokenChange', setInsightsContext);
      insightsClient('getUserToken', null, (_error, userToken) => {
        setInsightsContext(userToken);
      });

      onSelect(({ item, state, event, source }) => {
        if (!isAlgoliaInsightsHit(item)) {
          return;
        }

        onSelectEvent({
          state: state as AutocompleteState<any>,
          event,
          insights,
          item,
          insightsEvents: [
            {
              eventName: 'Item Selected',
              ...createClickedEvent({
                item,
                items: (source as AutocompleteReshapeSource<any>)
                  .getItems()
                  .filter(isAlgoliaInsightsHit),
              }),
            },
          ],
        });
      });

      onActive(({ item, source, state, event }) => {
        if (!isAlgoliaInsightsHit(item)) {
          return;
        }

        onActiveEvent({
          state: state as AutocompleteState<any>,
          event,
          insights,
          item,
          insightsEvents: [
            {
              eventName: 'Item Active',
              ...createClickedEvent({
                item,
                items: (source as AutocompleteReshapeSource<any>)
                  .getItems()
                  .filter(isAlgoliaInsightsHit),
              }),
            },
          ],
        });
      });
    },
    onStateChange({ state }) {
      debouncedOnStateChange({ state: state as AutocompleteState<any> });
    },
    __autocomplete_pluginOptions: options,
  };
}

function getOptions(options: CreateAlgoliaInsightsPluginParams) {
  return {
    onItemsChange({ insights, insightsEvents }: OnItemsChangeParams) {
      insights.viewedObjectIDs(
        ...insightsEvents.map((event) => ({
          ...event,
          algoliaSource: [
            ...(event.algoliaSource || []),
            'autocomplete-internal',
          ],
        }))
      );
    },
    onSelect({ insights, insightsEvents }: OnSelectParams) {
      insights.clickedObjectIDsAfterSearch(
        ...insightsEvents.map((event) => ({
          ...event,
          algoliaSource: [
            ...(event.algoliaSource || []),
            'autocomplete-internal',
          ],
        }))
      );
    },
    onActive: noop,
    __autocomplete_clickAnalytics: true,
    ...options,
  };
}

function loadInsights(environment: typeof window) {
  const errorMessage = `[Autocomplete]: Could not load search-insights.js. Please load it manually following https://alg.li/insights-autocomplete`;

  try {
    const script = environment.document.createElement('script');
    script.async = true;
    script.src = ALGOLIA_INSIGHTS_SRC;

    script.onerror = () => {
      // eslint-disable-next-line no-console
      console.error(errorMessage);
    };

    document.body.appendChild(script);
  } catch (cause) {
    // eslint-disable-next-line no-console
    console.error(errorMessage);
  }
}
