import { AlgoliaInsightsHit, ViewedObjectIDsParams } from './types';

type CreateViewedEventsParams = {
  items: AlgoliaInsightsHit[];
};

export function createViewedEvents({
  items,
}: CreateViewedEventsParams): Array<Omit<ViewedObjectIDsParams, 'eventName'>> {
  const objectIDsByIndexName = items.reduce<Record<string, string[]>>(
    (acc, current) => {
      acc[current.__autocomplete_indexName] = (
        acc[current.__autocomplete_indexName] ?? []
      ).concat(current.objectID);

      return acc;
    },
    {}
  );

  return Object.keys(objectIDsByIndexName).map((indexName) => {
    const objectIDs = objectIDsByIndexName[indexName];

    return {
      index: indexName,
      objectIDs,
    };
  });
}
