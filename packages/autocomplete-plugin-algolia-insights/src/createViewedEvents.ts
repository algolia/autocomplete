import {
  AlgoliaInsightsHit,
  InsightsParamsWithItems,
  ViewedObjectIDsParams,
} from './types';

type CreateViewedEventsParams = {
  items: AlgoliaInsightsHit[];
};

export function createViewedEvents({
  items,
}: CreateViewedEventsParams): Array<
  Omit<InsightsParamsWithItems<ViewedObjectIDsParams>, 'eventName'>
> {
  const itemsByIndexName = items.reduce<Record<string, AlgoliaInsightsHit[]>>(
    (acc, current) => {
      acc[current.__autocomplete_indexName] = (
        acc[current.__autocomplete_indexName] ?? []
      ).concat(current);

      return acc;
    },
    {}
  );

  return Object.keys(itemsByIndexName).map((indexName) => {
    const items = itemsByIndexName[indexName];

    return {
      index: indexName,
      items,
      algoliaSource: ['autocomplete'],
    };
  });
}
