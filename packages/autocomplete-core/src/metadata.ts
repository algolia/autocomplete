import { UserAgent, userAgents } from '@algolia/autocomplete-shared';

import {
  AutocompleteEnvironment,
  AutocompleteOptionsWithMetadata,
  AutocompletePlugin,
  BaseItem,
} from '.';

type AutocompleteMetadata = {
  plugins: Array<{
    name: string | undefined;
    options: string[];
  }>;
  options: {
    core: string[];
    js: string[];
  };
  ua: UserAgent[];
};

type GetMetadataParams<TItem extends BaseItem, TData = unknown> = {
  plugins: Array<AutocompletePlugin<TItem, TData>>;
  options: AutocompleteOptionsWithMetadata<TItem>;
};

export function getMetadata<TItem extends BaseItem, TData = unknown>({
  plugins,
  options,
}: GetMetadataParams<TItem, TData>) {
  return {
    plugins: plugins.map((plugin) => ({
      name: plugin.name,
      options: Object.keys(plugin.__autocomplete_pluginOptions || []),
    })),
    options: {
      aa_core: Object.keys(options),
      aa_js: Object.keys(
        (options.__autocomplete_metadata?.options as any) || []
      ),
    },
    ua: userAgents.concat(
      (options.__autocomplete_metadata?.userAgents as any) || []
    ),
  };
}

type InlineMetadataParams = {
  metadata: AutocompleteMetadata;
  environment: AutocompleteEnvironment;
};

export function injectMetadata({
  metadata,
  environment,
}: InlineMetadataParams) {
  const isMetadataEnabled = environment.navigator?.userAgent.includes(
    'Algolia Crawler'
  );

  if (isMetadataEnabled) {
    const metadataContainer = environment.document.createElement('meta');
    const headRef = environment.document.querySelector('head');

    metadataContainer.name = 'algolia:metadata';

    setTimeout(() => {
      metadataContainer.content = JSON.stringify(metadata);
      headRef!.appendChild(metadataContainer);
    }, 0);
  }
}
