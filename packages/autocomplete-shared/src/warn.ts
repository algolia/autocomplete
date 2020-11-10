export const warnCache = {
  current: {},
};

/**
 * Logs a warning if the condition is not met.
 * This is used to log issues in development environment only.
 */
export function warn(condition: boolean, message: string) {
  if (!__DEV__) {
    return;
  }

  if (condition) {
    return;
  }

  const sanitizedMessage = message.trim();
  const hasAlreadyPrinted = warnCache.current[sanitizedMessage];

  if (!hasAlreadyPrinted) {
    warnCache.current[sanitizedMessage] = true;

    // eslint-disable-next-line no-console
    console.warn(`[Autocomplete] ${sanitizedMessage}`);
  }
}
