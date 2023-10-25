import { createSearchInsightsApi } from '../createSearchInsightsApi';
import { AlgoliaInsightsHit } from '../types';

function getAlgoliaItems(count: number): AlgoliaInsightsHit[] {
  return Array.from({ length: count }).map((_, i) => ({
    objectID: i.toString(),
    __autocomplete_algoliaCredentials: {
      appId: 'algoliaAppId',
      apiKey: 'algoliaApiKey',
    },
    __autocomplete_indexName: 'index1',
    __autocomplete_queryID: 'queryID',
  }));
}

describe('createSearchInsightsApi', () => {
  describe('with supported client versions', () => {
    const insightsClient = jest.fn();
    // @ts-ignore
    insightsClient.version = '2.4.0';
    const insightsApi = createSearchInsightsApi(insightsClient);

    beforeEach(() => {
      insightsClient.mockReset();
    });

    test('clickedObjectIDsAfterSearch() sends events with additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.clickedObjectIDsAfterSearch({
        eventName: 'Items Clicked',
        index: 'index1',
        items,
        positions: [1],
        queryID: 'queryID',
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'clickedObjectIDsAfterSearch',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId',
            'X-Algolia-API-Key': 'algoliaApiKey',
          },
        }
      );
    });

    test('clickedObjectIDs() sends events with additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.clickedObjectIDs({
        eventName: 'Items Clicked',
        index: 'index1',
        items,
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'clickedObjectIDs',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId',
            'X-Algolia-API-Key': 'algoliaApiKey',
          },
        }
      );
    });

    test('convertedObjectIDsAfterSearch() sends events with additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.convertedObjectIDsAfterSearch({
        eventName: 'Items Added to cart',
        index: 'index1',
        items,
        queryID: 'queryID',
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'convertedObjectIDsAfterSearch',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId',
            'X-Algolia-API-Key': 'algoliaApiKey',
          },
        }
      );
    });

    test('convertedObjectIDs() sends events with additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.convertedObjectIDs({
        eventName: 'Items Added to cart',
        index: 'index1',
        items,
        userToken: 'userToken',
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'convertedObjectIDs',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId',
            'X-Algolia-API-Key': 'algoliaApiKey',
          },
        }
      );
    });

    test('viewedObjectIDs() sends events with additional parameters', () => {
      const items = getAlgoliaItems(10);

      insightsApi.viewedObjectIDs({
        eventName: 'Items Viewed',
        index: 'index1',
        items,
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'viewedObjectIDs',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        }),
        {
          headers: {
            'X-Algolia-Application-Id': 'algoliaAppId',
            'X-Algolia-API-Key': 'algoliaApiKey',
          },
        }
      );
    });
  });

  describe('with unsupported client versions', () => {
    const insightsClient = jest.fn();
    const insightsApi = createSearchInsightsApi(insightsClient);

    beforeEach(() => {
      insightsClient.mockReset();
    });

    test('clickedObjectIDsAfterSearch() sends events without additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.clickedObjectIDsAfterSearch({
        eventName: 'Items Clicked',
        index: 'index1',
        items,
        positions: [1],
        queryID: 'queryID',
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'clickedObjectIDsAfterSearch',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        })
      );
    });

    test('clickedObjectIDs() sends events without additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.clickedObjectIDs({
        eventName: 'Items Clicked',
        index: 'index1',
        items,
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'clickedObjectIDs',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        })
      );
    });

    test('convertedObjectIDsAfterSearch() sends events without additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.convertedObjectIDsAfterSearch({
        eventName: 'Items Added to cart',
        index: 'index1',
        items,
        queryID: 'queryID',
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'convertedObjectIDsAfterSearch',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        })
      );
    });

    test('convertedObjectIDs() sends events without additional parameters', () => {
      const items = getAlgoliaItems(1);

      insightsApi.convertedObjectIDs({
        eventName: 'Items Added to cart',
        index: 'index1',
        items,
        userToken: 'userToken',
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'convertedObjectIDs',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        })
      );
    });

    test('viewedObjectIDs() sends events without additional parameters', () => {
      const items = getAlgoliaItems(10);

      insightsApi.viewedObjectIDs({
        eventName: 'Items Viewed',
        index: 'index1',
        items,
      });

      expect(insightsClient).toHaveBeenCalledTimes(1);
      expect(insightsClient).toHaveBeenCalledWith(
        'viewedObjectIDs',
        expect.objectContaining({
          objectIDs: items.map(({ objectID }) => objectID),
        })
      );
    });
  });

  test('allows arbitrary additional data to be sent', () => {
    const insightsClient = jest.fn();
    const insightsApi = createSearchInsightsApi(insightsClient);

    insightsApi.convertedObjectIDsAfterSearch({
      // Regular properties
      eventName: 'Items Added to cart',
      index: 'index1',
      items: getAlgoliaItems(1),
      queryID: 'queryID',
      // Extra additional properties
      eventSubtype: 'purchase',
      objectData: [
        { discount: 0, price: 100, quantity: 1, queryID: 'queryID' },
      ],
      value: 100,
      currency: 'USD',
    });

    expect(insightsClient).toHaveBeenCalledWith(
      'convertedObjectIDsAfterSearch',
      {
        eventName: 'Items Added to cart',
        index: 'index1',
        objectIDs: ['0'],
        queryID: 'queryID',
        eventSubtype: 'purchase',
        objectData: [
          { discount: 0, price: 100, quantity: 1, queryID: 'queryID' },
        ],
        value: 100,
        currency: 'USD',
      }
    );
  });

  test('viewedObjectIDs() splits large payloads into multiple chunks', () => {
    const insightsClient = jest.fn();
    const insightsApi = createSearchInsightsApi(insightsClient);

    insightsApi.viewedObjectIDs({
      eventName: 'Items Viewed',
      index: 'index1',
      items: getAlgoliaItems(50),
    });

    expect(insightsClient).toHaveBeenCalledTimes(3);
    expect(insightsClient).toHaveBeenNthCalledWith(1, 'viewedObjectIDs', {
      eventName: 'Items Viewed',
      index: 'index1',
      objectIDs: Array.from({ length: 20 }, (_, i) => `${i}`),
    });
    expect(insightsClient).toHaveBeenNthCalledWith(2, 'viewedObjectIDs', {
      eventName: 'Items Viewed',
      index: 'index1',
      objectIDs: Array.from({ length: 20 }, (_, i) => `${i + 20}`),
    });
    expect(insightsClient).toHaveBeenNthCalledWith(3, 'viewedObjectIDs', {
      eventName: 'Items Viewed',
      index: 'index1',
      objectIDs: Array.from({ length: 10 }, (_, i) => `${i + 40}`),
    });
  });
});
