import type { InsightsClient } from './types';

/**
 * Determines if a given insights `client` supports the optional call to `init`
 * and the ability to set credentials via extra parameters when sending events.
 */
export function isModernInsightsClient(client: InsightsClient): boolean {
  const [major, minor] = (client.version || '').split('.').map(Number);

  /* eslint-disable @typescript-eslint/camelcase */
  const v3 = major >= 3;
  const v2_4 = major === 2 && minor >= 4;
  const v1_10 = major === 1 && minor >= 10;

  return v3 || v2_4 || v1_10;
  /* eslint-enable @typescript-eslint/camelcase */
}
