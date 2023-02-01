// @ts-ignore
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';

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
    insightsClient('init', {
      appId: searchClient.appId,
      apiKey: searchClient.transporter.queryParameters['x-algolia-api-key'],
      useCookie: true,
    });

    const insightsPlugin = createAlgoliaInsightsPlugin({
      insightsClient,
    }); /*  as AutocompletePlugin<any, any> */

    props.plugins.push(insightsPlugin);
  }
}
