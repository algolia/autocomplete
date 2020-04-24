import React from 'react';
import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser';

export function useSearchClient(appId: string, apiKey: string) {
  const searchClient = React.useMemo(() => {
    const client = algoliasearch(appId, apiKey);
    client.addAlgoliaAgent(`docsearch (${__VERSION__})`);

    return client;
  }, [appId, apiKey]);

  return searchClient;
}
