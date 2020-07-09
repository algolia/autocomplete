import React from 'react';
import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser';

import { SearchClient } from './types';
import { version } from './version';

export function useSearchClient(
  appId: string,
  apiKey: string,
  transformSearchClient: (searchClient: SearchClient) => SearchClient
): SearchClient {
  const searchClient = React.useMemo(() => {
    const client = algoliasearch(appId, apiKey);
    client.addAlgoliaAgent(`docsearch (${version})`);

    return transformSearchClient(client);
  }, [appId, apiKey, transformSearchClient]);

  return searchClient;
}
