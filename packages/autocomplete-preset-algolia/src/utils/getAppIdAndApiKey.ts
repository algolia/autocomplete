// typed as any, since it accepts the _real_ js clients, not the interface we otherwise expect
export function getAppIdAndApiKey(searchClient: any): {
  appId: string;
  apiKey: string;
} {
  const transporter = searchClient.transporter || {};
  const headers = transporter.headers || transporter.baseHeaders || {};
  const queryParameters =
    transporter.queryParameters || transporter.baseQueryParameters || {};
  const APP_ID = 'x-algolia-application-id';
  const API_KEY = 'x-algolia-api-key';
  const appId = headers[APP_ID] || queryParameters[APP_ID];
  const apiKey = headers[API_KEY] || queryParameters[API_KEY];
  return { appId, apiKey };
}
