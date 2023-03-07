type BrowserCallback<TReturn> = (params: { window: typeof window }) => TReturn;

type SafelyRunOnBrowserOptions<TReturn> = {
  /**
   * Fallback to run on server environments.
   */
  fallback: () => TReturn;
};

/**
 * Safely runs code meant for browser environments only.
 */
export function safelyRunOnBrowser<TReturn>(
  callback: BrowserCallback<TReturn>,
  { fallback }: SafelyRunOnBrowserOptions<TReturn> = {
    fallback: () => (undefined as unknown) as TReturn,
  }
): TReturn {
  if (typeof window === 'undefined') {
    return fallback();
  }

  return callback({ window });
}
