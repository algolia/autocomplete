import type { SearchClient } from '../types';

export function getAppIdAndApiKey(
  searchClient: SearchClient
): { appId: string; apiKey: string } {
  const { headers, queryParameters } = searchClient.transporter;
  const APP_ID = 'x-algolia-application-id';
  const API_KEY = 'x-algolia-api-key';
  const appId = headers[APP_ID] || queryParameters[APP_ID];
  const apiKey = headers[API_KEY] || queryParameters[API_KEY];
  return { appId, apiKey };
}
