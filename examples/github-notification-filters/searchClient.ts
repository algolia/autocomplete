import algoliasearch from 'algoliasearch/lite';

const appId = 'latency';
const apiKey = '147a0e7dbc37d4c4dec9ec31b0f68716';

export const searchClient = algoliasearch(appId, apiKey);
