type BrowserCallback<TReturn> = (params: { window: typeof window }) => TReturn;

/**
 * Safely runs code meant for browser environments only.
 */
export function safelyRunOnBrowser<TReturn>(
  callback: BrowserCallback<TReturn>
): TReturn | undefined {
  if (typeof window !== 'undefined') {
    return callback({ window });
  }

  return undefined;
}
