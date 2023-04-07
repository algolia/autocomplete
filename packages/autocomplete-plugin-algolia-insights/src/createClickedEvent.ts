import { AlgoliaInsightsHit, ClickedObjectIDsAfterSearchParams } from './types';

type CreateClickedEventParams = {
  item: AlgoliaInsightsHit;
  items: AlgoliaInsightsHit[];
};

export function createClickedEvent({
  item,
  items,
}: CreateClickedEventParams): Omit<
  ClickedObjectIDsAfterSearchParams,
  'eventName'
> & { algoliaSource?: string[] } {
  return {
    index: item.__autocomplete_indexName,
    objectIDs: [item.objectID],
    positions: [1 + items.findIndex((x) => x.objectID === item.objectID)],
    queryID: item.__autocomplete_queryID,
    algoliaSource: ['autocomplete'],
  };
}
