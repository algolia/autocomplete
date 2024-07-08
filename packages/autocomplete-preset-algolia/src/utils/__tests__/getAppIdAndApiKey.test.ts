import algoliasearchV4 from 'algoliasearch';
import { liteClient as algoliasearchV5 } from 'algoliasearch-v5/lite';

import { getAppIdAndApiKey } from '../getAppIdAndApiKey';

const APP_ID = 'myAppId';
const API_KEY = 'myApiKey';

describe('getAppIdAndApiKey', () => {
  it('gets appId and apiKey from searchClient@v4', () => {
    const searchClient = algoliasearchV4(APP_ID, API_KEY);
    const { appId, apiKey } = getAppIdAndApiKey(searchClient);
    expect(appId).toEqual(APP_ID);
    expect(apiKey).toEqual(API_KEY);
  });

  it('gets appId and apiKey from searchClient@v5', () => {
    const searchClient = algoliasearchV5(APP_ID, API_KEY);
    const { appId, apiKey } = getAppIdAndApiKey(searchClient);
    expect(appId).toEqual(APP_ID);
    expect(apiKey).toEqual(API_KEY);
  });

  it('gets undefined appId and apiKey from broken search client', () => {
    const searchClient = {
      search: algoliasearchV4(APP_ID, API_KEY).search,
    };
    const { appId, apiKey } = getAppIdAndApiKey(searchClient);
    expect(appId).toEqual(undefined);
    expect(apiKey).toEqual(undefined);
  });
});
