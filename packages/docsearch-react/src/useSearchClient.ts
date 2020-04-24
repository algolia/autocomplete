import React from 'react';
import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser';

import { version } from './version';

export function useSearchClient(appId: string, apiKey: string) {
  const searchClient = React.useMemo(() => {
    const client = algoliasearch(appId, apiKey);
    client.addAlgoliaAgent(`docsearch (${version})`);

    return client;
  }, [appId, apiKey]);

  return searchClient;
}
