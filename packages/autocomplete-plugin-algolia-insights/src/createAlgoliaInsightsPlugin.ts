import {
  AutocompletePlugin,
  AutocompleteState,
} from '@algolia/autocomplete-core';
import { createRef, debounce, isEqual } from '@algolia/autocomplete-shared';

import { createClickedEvent } from './createClickedEvent';
import { createSearchInsightsApi } from './createSearchInsightsApi';
import { createViewedEvents } from './createViewedEvents';
import { isAlgoliaInsightsHit } from './isAlgoliaInsightsHit';
import {
  AlgoliaInsightsHit,
  InsightsApi,
  InsightsClient,
  OnHighlightParams,
  OnItemsChangeParams,
  OnSelectParams,
} from './types';

const VIEW_EVENT_DELAY = 400;

type SendViewedObjectIDsParams = {
  onItemsChange(params: OnItemsChangeParams): void;
  items: AlgoliaInsightsHit[];
  insights: InsightsApi;
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
   */
  insightsClient: InsightsClient;
  /**
   * Hook to send an Insights event when the items change.
   *
   * This hook is debounced every 400ms to better reflect when items are
   * acknowledged by the user.
   */
  onItemsChange?(params: OnItemsChangeParams): void;
  /**
   * Hook to send an Insights event when an item is selected.
   */
  onSelect?(params: OnSelectParams): void;
  /**
   * Hook to send an Insights event when an item is active.
   */
  onActive?(params: OnHighlightParams): void;
};

export function createAlgoliaInsightsPlugin({
  insightsClient,
  onItemsChange = ({ insights, insightsEvents }) => {
    insights.viewedObjectIDs(...insightsEvents);
  },
  onSelect: onSelectEvent = ({ insights, insightsEvents }) => {
    insights.clickedObjectIDsAfterSearch(...insightsEvents);
  },
  onActive: onActiveEvent = () => {},
}: CreateAlgoliaInsightsPluginParams): AutocompletePlugin<any, undefined> {
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
    subscribe({ setContext, onSelect, onActive }) {
      setContext({ algoliaInsightsPlugin: { insights } });

      onSelect(({ item, state, event }) => {
        if (!isAlgoliaInsightsHit(item)) {
          return;
        }

        onSelectEvent({
          state,
          event,
          insights,
          item,
          insightsEvents: [
            {
              eventName: 'Item Selected',
              ...createClickedEvent({ item, items: previousItems.current }),
            },
          ],
        });
      });

      onActive(({ item, state, event }) => {
        if (!isAlgoliaInsightsHit(item)) {
          return;
        }

        onActiveEvent({
          state,
          event,
          insights,
          item,
          insightsEvents: [
            {
              eventName: 'Item Active',
              ...createClickedEvent({ item, items: previousItems.current }),
            },
          ],
        });
      });
    },
    onStateChange({ state }) {
      debouncedOnStateChange({ state });
    },
  };
}
