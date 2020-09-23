import { Hit } from '@algolia/client-search';

import { search, SearchParams } from './search';

export function getAlgoliaHits<THit>({
  searchClient,
  queries,
}: SearchParams): Promise<Array<Array<Hit<THit>>>> {
  return search<THit>({ searchClient, queries }).then((response) => {
    const results = response.results;

    return results.map((result) => result.hits);
  });
}
