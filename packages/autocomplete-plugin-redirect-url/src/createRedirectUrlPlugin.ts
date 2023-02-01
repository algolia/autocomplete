import {
  AutocompletePlugin,
  AutocompleteState,
  BaseItem,
  InternalAutocompleteOptions,
  AutocompleteReshapeSource,
} from '@algolia/autocomplete-core';
import { AutocompleteSource, SourceTemplates } from '@algolia/autocomplete-js';
import { TransformResponse } from '@algolia/autocomplete-preset-algolia';
import { warn } from '@algolia/autocomplete-shared';

import { RedirectItem, RedirectPlugin as RedirectPluginData } from './types';

export type OnRedirectOptions<TItem extends RedirectItem> = {
  navigator: InternalAutocompleteOptions<TItem>['navigator'];
  state: AutocompleteState<TItem>;
};

type TransformResponseParams<TItem> = Parameters<TransformResponse<TItem>>[0];

export type CreateRedirectUrlPluginParams<TItem extends BaseItem> = {
  transformResponse?(response: TransformResponseParams<TItem>): RedirectItem[];
  onRedirect?(
    redirects: RedirectItem[],
    options: OnRedirectOptions<RedirectItem>
  ): void;
  templates?: SourceTemplates<RedirectItem>;
};

function defaultTransformResponse<THit>(
  response: TransformResponseParams<THit>
): string | undefined {
  return (response as Record<string, any>).renderingContent?.redirect?.url;
}

const defaultTemplates = {
  item({ state }) {
    return '->' + state.query;
  },
};

function defaultOnRedirect(
  redirects: RedirectItem[],
  { navigator, state }: OnRedirectOptions<RedirectItem>
) {
  const itemUrl = redirects[0]?.urls?.[0];
  if (itemUrl) {
    navigator.navigate({ itemUrl, item: redirects[0], state });
  }
}

export function createRedirectUrlPlugin<TItem extends RedirectItem>(
  options: CreateRedirectUrlPluginParams<TItem> = {}
): AutocompletePlugin<TItem> {
  const {
    transformResponse = defaultTransformResponse,
    templates = defaultTemplates,
    onRedirect = defaultOnRedirect,
  } = options;

  function createRedirects({ results, source, state }): RedirectItem[] {
    const redirect: RedirectItem = {
      sourceId: source.sourceId,
      urls: results
        .map((result) => transformResponse(result))
        .filter((url) => url !== undefined),
    };

    const redirects: RedirectItem[] =
      state.context.redirectUrlPlugin?.data ?? [];
    const existingRedirectIndex = redirects.findIndex(
      (r) => r.sourceId === source.sourceId
    );

    if (existingRedirectIndex !== -1) {
      if (redirect.urls.length === 0) {
        redirects.splice(existingRedirectIndex, 1);
      } else {
        redirects[existingRedirectIndex] = redirect;
      }
    } else if (redirect.urls.length > 0) {
      redirects.push(redirect);
    }

    return redirects;
  }

  let navigator: InternalAutocompleteOptions<RedirectItem>['navigator'];

  return {
    name: 'redirectUrlPlugin',
    subscribe({ onResolve, setContext, props }) {
      navigator = props.navigator;
      onResolve(({ results, source, state }) => {
        setContext({
          ...state.context,
          redirectUrlPlugin: {
            data: createRedirects({ results, source, state }),
          },
        });
      });
    },
    reshape({ state, sourcesBySourceId }) {
      const redirects =
        (state.context.redirectUrlPlugin as RedirectPluginData)?.data ?? [];

      redirects.forEach((redirect) => {
        const source = sourcesBySourceId[redirect.sourceId];
        if (source === undefined) {
          return;
        }

        sourcesBySourceId[redirect.sourceId] = {
          ...source,
          getItems: () =>
            source.getItems().filter((item) => {
              const itemInputValue = source.getItemInputValue?.({
                item,
                state,
              });
              if (itemInputValue === undefined) {
                return true;
              }

              return itemInputValue.toLowerCase() !== state.query.toLowerCase();
            }),
        };
      });

      const redirectSource: AutocompleteSource<RedirectItem> = {
        sourceId: 'redirectUrlPlugin',
        templates,
        getItemUrl({ item }) {
          return item.urls[0];
        },
        onSelect({ item, state }) {
          onRedirect([item], { navigator, state });
        },
        getItemInputValue() {
          return state.query;
        },
        onActive() {},
        getItems() {
          return (state.context.redirectUrlPlugin as RedirectPluginData)
            .data as TItem[];
        },
      };

      warn(
        sourcesBySourceId.redirect === undefined,
        'A source with `sourceId: "redirect"` already exists. This source will be overridden.]'
      );

      return {
        sourcesBySourceId: {
          // we are not actually returning TItem, as it's a redirect, but reshape doesn't know that
          redirect: (redirectSource as unknown) as AutocompleteReshapeSource<TItem>,
          ...sourcesBySourceId,
        },
        state,
      };
    },
    onSubmit({ state }) {
      onRedirect(
        (state.context.redirectUrlPlugin as RedirectPluginData).data as TItem[],
        { navigator, state }
      );
    },
  };
}
