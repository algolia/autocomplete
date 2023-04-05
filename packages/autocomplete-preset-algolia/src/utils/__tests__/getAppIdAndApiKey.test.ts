import algoliasearchV4 from 'algoliasearch';

import { getAppIdAndApiKey } from '../getAppIdAndApiKey';

const APP_ID = 'myAppId';
const API_KEY = 'myApiKey';

describe('getAppIdAndApiKey', () => {
  it('gets appId and apiKey from searchClient', () => {
    const searchClient = algoliasearchV4(APP_ID, API_KEY);
    const [appId, apiKey] = getAppIdAndApiKey(searchClient);
    expect(appId).toEqual(APP_ID);
    expect(apiKey).toEqual(API_KEY);
  });
});
