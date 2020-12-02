import { AlgoliaInsightsHit } from './types';

export function isAlgoliaInsightsHit(hit: any): hit is AlgoliaInsightsHit {
  return (
    hit.objectID && hit.__autocomplete_indexName && hit.__autocomplete_queryID
  );
}
