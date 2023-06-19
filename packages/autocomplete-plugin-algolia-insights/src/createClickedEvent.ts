import type {
  AlgoliaInsightsHit,
  ClickedObjectIDsAfterSearchParams,
  InsightsParamsWithItems,
} from './types';

type CreateClickedEventParams = {
  item: AlgoliaInsightsHit;
  items: AlgoliaInsightsHit[];
};

export function createClickedEvent({
  item,
  items = [],
}: CreateClickedEventParams): Omit<
  InsightsParamsWithItems<ClickedObjectIDsAfterSearchParams>,
  'eventName'
> & { algoliaSource?: string[] } {
  return {
    index: item.__autocomplete_indexName,
    items: [item],
    positions: [1 + items.findIndex((x) => x.objectID === item.objectID)],
    queryID: item.__autocomplete_queryID,
    algoliaSource: ['autocomplete'],
  };
}
