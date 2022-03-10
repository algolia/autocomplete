import algoliasearch from 'algoliasearch/lite';

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';

export const searchClient = algoliasearch(appId, apiKey);
