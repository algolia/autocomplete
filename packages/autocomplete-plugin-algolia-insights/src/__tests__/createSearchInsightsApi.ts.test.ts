import { createSearchInsightsApi } from '../createSearchInsightsApi';

describe('createSearchInsightsApi', () => {
  test('viewedObjectIDs splits large payloads into multiple chunks', () => {
    const insightsClient = jest.fn();
    const insightsApi = createSearchInsightsApi(insightsClient);

    insightsApi.viewedObjectIDs({
      eventName: 'Items Viewed',
      index: 'index1',
      objectIDs: Array.from({ length: 50 }, (_, i) => `${i}`),
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
