// @ts-ignore
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';

// from: https://github.com/algolia/instantsearch/blob/master/packages/instantsearch.js/src/lib/utils/getAppIdAndApiKey.ts
// typed as any, since it accepts the _real_ js clients, not the interface we otherwise expect
export function getSearchClientCredentials(
  searchClient: any
): [string, string] {
  if (searchClient.transporter) {
    // searchClient v4
    const { headers, queryParameters } = searchClient.transporter;
    const APP_ID = 'x-algolia-application-id';
    const API_KEY = 'x-algolia-api-key';
    const appId = headers[APP_ID] || queryParameters[APP_ID];
    const apiKey = headers[API_KEY] || queryParameters[API_KEY];
    return [appId, apiKey];
  } else {
    // searchClient v3
    return [searchClient.applicationID, searchClient.apiKey];
  }
}

export function loadInsightsPlugin(props: any) {
  // We assume the logic for downloading automatically Algolia Insights
  // is defined here and the following code depends on it.
  const insightsClient = (props.environment.window as Window & {
    aa: (...args: any[]) => void;
  }).aa;

  // Iterate over plugins and add algoliaInsights plugin if
  // - it isn't already added
  // - existing plugins have a reference to `searchClient` OR
  // ?: Is there a way to also detect when `getAlgoliaResult()`
  //    is used in a source?
  const hasAlgoliaInsightsPlugin = props.plugins.some(
    (plugin) => plugin.name === 'aa.algoliaInsightsPlugin'
  );
  const { __autocomplete_pluginOptions } =
    props.plugins.find(
      (plugin) => plugin.__autocomplete_pluginOptions?.searchClient
    ) || {};
  const searchClient = __autocomplete_pluginOptions?.searchClient;

  if (!hasAlgoliaInsightsPlugin && searchClient) {
    const insightsPlugin = createAlgoliaInsightsPlugin({
      insightsClient,
    });

    props.plugins.push(insightsPlugin);

    // Initialize Insights Client (works even if done asynchronously)
    Promise.all([
      new Promise<string>((resolve) => insightsClient('getVersion', resolve)),
      new Promise<string | undefined>((resolve) =>
        insightsClient('getUserToken', null, (err, token) => resolve(token))
      ),
    ]).then(([version, userToken]) => {
      if (userToken) {
        return;
      }

      const [appId, apiKey] = getSearchClientCredentials(searchClient);

      insightsClient('init', {
        appId,
        apiKey,
        ...(version.split('.').shift() === '2' && { useCookie: true }),
      });
    });
  }
}
