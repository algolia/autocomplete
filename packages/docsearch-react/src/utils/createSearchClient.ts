import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser';

import { version } from '../version';

export function createSearchClient(appId: string, apiKey: string) {
  const searchClient = algoliasearch(appId, apiKey);

  if (typeof searchClient.addAlgoliaAgent === 'function') {
    searchClient.addAlgoliaAgent(`docsearch-react (${version})`);
  }

  return searchClient;
}
