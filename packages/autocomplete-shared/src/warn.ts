export const warnCache = {
  current: {},
};

export function warn(message: string) {
  const sanitizedMessage = message.trim();
  const hasAlreadyPrinted = warnCache.current[sanitizedMessage];

  if (!hasAlreadyPrinted) {
    warnCache.current[sanitizedMessage] = true;

    // eslint-disable-next-line no-console
    console.warn(sanitizedMessage);
  }
}
