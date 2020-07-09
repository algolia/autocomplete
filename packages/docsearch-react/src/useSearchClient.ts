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
    client.addAlgoliaAgent('docsearch', version);

    // Since DocSearch.js relies on DocSearch React with an alias to Preact,
    // we cannot add the `docsearch-react` user agent by default, otherwise
    // it would also be sent on a DocSearch.js integration.
    // We therefore only add the `docsearch-react` user agent if `docsearch.js`
    // is not present.
    if (
      /docsearch.js \(.*\)/.test(client.transporter.userAgent.value) === false
    ) {
      client.addAlgoliaAgent('docsearch-react', version);
    }

    return transformSearchClient(client);
  }, [appId, apiKey, transformSearchClient]);

  return searchClient;
}
