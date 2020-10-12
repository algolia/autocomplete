import { Hit } from '@algolia/client-search';

import { search, SearchParams } from './search';

export function getAlgoliaHits<TRecord>({
  searchClient,
  queries,
}: SearchParams): Promise<Array<Array<Hit<TRecord>>>> {
  return search<TRecord>({ searchClient, queries }).then((response) => {
    const results = response.results;

    return results.map((result) => result.hits);
  });
}
