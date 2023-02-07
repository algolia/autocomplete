import {
  BaseItem,
  OnSelectParams,
  OnSubmitParams,
} from '@algolia/autocomplete-core';
import { AutocompletePlugin } from '@algolia/autocomplete-js';
import { warn } from '@algolia/autocomplete-shared';

import { defaultTemplates } from './templates';
import {
  CreateRedirectUrlPluginParams,
  OnRedirectOptions,
  RedirectUrlItem,
  RedirectUrlPlugin as RedirectUrlPluginData,
  TransformResponseParams,
} from './types';

function defaultTransformResponse<THit>(
  response: TransformResponseParams<THit>
): string | undefined {
  return (response as Record<string, any>).renderingContent?.redirect?.url;
}

function defaultOnRedirect(
  redirects: RedirectUrlItem[],
  { navigator, state, event }: OnRedirectOptions<RedirectUrlItem>
) {
  const item = redirects[0];
  const itemUrl = item?.urls?.[0];

  if (!itemUrl) {
    return;
  }

  if (event.metaKey || event.ctrlKey) {
    navigator.navigateNewTab({ itemUrl, item, state });
  } else if (event.shiftKey) {
    navigator.navigateNewWindow({ itemUrl, item, state });
  } else {
    navigator.navigate({ itemUrl, item, state });
  }
}

function getOptions<TItem extends BaseItem>(
  options: CreateRedirectUrlPluginParams<TItem>
) {
  return {
    transformResponse: defaultTransformResponse,
    templates: defaultTemplates,
    onRedirect: defaultOnRedirect,
    ...options,
  };
}

function getRedirectData({ state }) {
  const redirectUrlPlugin = state.context
    .redirectUrlPlugin as RedirectUrlPluginData;
  return (redirectUrlPlugin?.data ?? []) as RedirectUrlItem[];
}

export function createRedirectUrlPlugin<TItem extends BaseItem>(
  options: CreateRedirectUrlPluginParams<TItem>
): AutocompletePlugin<RedirectUrlItem, undefined> {
  const { transformResponse, templates, onRedirect } = getOptions(options);

  function createRedirects({ results, source, state }): RedirectUrlItem[] {
    const redirect: RedirectUrlItem = {
      sourceId: source.sourceId,
      urls: results
        .map((result) => transformResponse(result))
        .filter((url) => url !== undefined),
    };

    const redirects: RedirectUrlItem[] =
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

  return {
    name: 'aa.redirectUrlPlugin',
    subscribe({ onResolve, setContext }) {
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
        (state.context.redirectUrlPlugin as RedirectUrlPluginData)?.data ?? [];

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

      const redirectSource = {
        sourceId: 'redirectUrlPlugin',
        templates,
        getItemUrl({ item }) {
          return item.urls[0];
        },
        onSelect({ item, state, navigator }: OnSelectParams<RedirectUrlItem>) {
          onRedirect([item], { navigator, state });
        },
        getItemInputValue() {
          return state.query;
        },
        onActive() {},
        getItems() {
          return getRedirectData({ state });
        },
      };

      warn(
        sourcesBySourceId.redirect === undefined,
        'A source with `sourceId: "redirect"` already exists. This source will be overridden.'
      );

      return {
        sourcesBySourceId: {
          // Our source has templates, but reshape only accepts sources without templates (autocomplete-core)
          redirect: (redirectSource as unknown) as typeof sourcesBySourceId[string],
          ...sourcesBySourceId,
        },
        state,
      };
    },
    onSubmit({ state, navigator }: OnSubmitParams<RedirectUrlItem>) {
      onRedirect(getRedirectData({ state }), { navigator, state });
    },
    __autocomplete_pluginOptions: options,
  };
}