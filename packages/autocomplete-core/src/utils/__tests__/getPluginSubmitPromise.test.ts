import { InternalAutocompleteOptions } from '../../types';
import {
  getPluginSubmitPromise,
  createCancelablePromise,
  createCancelablePromiseList,
  CancelablePromiseList,
  CancelablePromise,
} from '../../utils';

const createMockedCancelablePromiseList = () => {
  const cancelablePromiseList = createCancelablePromiseList();
  const cancelablePromise = createCancelablePromise.resolve();
  cancelablePromiseList.add(cancelablePromise);
  cancelablePromiseList.add(cancelablePromise);
  cancelablePromiseList.add(cancelablePromise);

  return cancelablePromiseList as CancelablePromiseList<void>;
};

describe('getPluginSubmitPromise', () => {
  describe('a plugin is configured with "awaitSubmit: () => true"', () => {
    test('should return a promise awaiting all pending requests', async () => {
      const plugins: InternalAutocompleteOptions<any>['plugins'] = [
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => true },
        },
      ];
      const cancelablePromiseList = createMockedCancelablePromiseList();

      expect(cancelablePromiseList.isEmpty()).toBe(false);

      await getPluginSubmitPromise(plugins, cancelablePromiseList);

      expect(cancelablePromiseList.isEmpty()).toBe(true);
    });

    test('should override any other plugins with timeout numbers or false values configured', async () => {
      const plugins: InternalAutocompleteOptions<any>['plugins'] = [
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => true },
        },
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => 50 },
        },
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => false },
        },
      ];
      const cancelablePromiseList = createMockedCancelablePromiseList();

      expect(cancelablePromiseList.isEmpty()).toBe(false);

      await getPluginSubmitPromise(plugins, cancelablePromiseList);

      expect(cancelablePromiseList.isEmpty()).toBe(true);
    });
  });

  describe('a plugin is configured with "awaitSubmit: () => timeout"', () => {
    test('should return a promise awaiting the timeout when it is reached', async () => {
      const timeout = 50; // impractical, but kept short to not stall the test too long
      const plugins: InternalAutocompleteOptions<any>['plugins'] = [
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => timeout },
        },
      ];
      const cancelablePromiseList = createMockedCancelablePromiseList();
      const delayedPromise: CancelablePromise<void> = createCancelablePromise(
        (resolve) => setTimeout(resolve, timeout * 10) // ensure wait will be later than timeout
      );
      cancelablePromiseList.add(delayedPromise);

      expect(cancelablePromiseList.isEmpty()).toBe(false);

      await getPluginSubmitPromise(plugins, cancelablePromiseList);

      // List is not emptied yet because the timeout triggered first
      expect(cancelablePromiseList.isEmpty()).toBe(false);
    });

    test('should override any other plugins with a false value configured', async () => {
      const timeout = 50; // impractical, but kept short to not stall the test too long
      const plugins: InternalAutocompleteOptions<any>['plugins'] = [
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => timeout },
        },
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => false },
        },
      ];
      const cancelablePromiseList = createMockedCancelablePromiseList();
      const delayedPromise: CancelablePromise<void> = createCancelablePromise(
        (resolve) => setTimeout(resolve, timeout * 10) // ensure wait will be later than timeout
      );
      cancelablePromiseList.add(delayedPromise);

      expect(cancelablePromiseList.isEmpty()).toBe(false);

      await getPluginSubmitPromise(plugins, cancelablePromiseList);

      // List is not emptied yet because the timeout triggered first
      expect(cancelablePromiseList.isEmpty()).toBe(false);
    });

    test('should return a promise awaiting all pending requests when the timeout is not reached', async () => {
      const timeout = 20000; // long wait to ensure all promises have a chance to resolve first
      const plugins: InternalAutocompleteOptions<any>['plugins'] = [
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => timeout },
        },
      ];
      const cancelablePromiseList = createMockedCancelablePromiseList();

      expect(cancelablePromiseList.isEmpty()).toBe(false);

      await getPluginSubmitPromise(plugins, cancelablePromiseList);

      expect(cancelablePromiseList.isEmpty()).toBe(true);
    });
  });

  describe('a plugin is configured with "awaitSubmit: () => false"', () => {
    test('should return undefined', () => {
      const plugins: InternalAutocompleteOptions<any>['plugins'] = [
        {
          __autocomplete_pluginOptions: { awaitSubmit: () => false },
        },
      ];
      const cancelablePromiseList = createMockedCancelablePromiseList();

      const submitPromise = getPluginSubmitPromise(
        plugins,
        cancelablePromiseList
      );

      expect(submitPromise).toBe(undefined);
    });
  });

  describe('a plugin is not configured with "awaitSubmit"', () => {
    test('should return undefined', () => {
      const plugins: InternalAutocompleteOptions<any>['plugins'] = [{}];
      const cancelablePromiseList = createMockedCancelablePromiseList();

      const submitPromise = getPluginSubmitPromise(
        plugins,
        cancelablePromiseList
      );

      expect(submitPromise).toBe(undefined);
    });
  });
});
