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
  { event, navigator, state }: OnRedirectOptions<RedirectUrlItem>
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
  options: CreateRedirectUrlPluginParams<TItem> = {}
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
    subscribe({ onResolve, onSelect, setContext, setIsOpen }) {
      onResolve(({ results, source, state }) => {
        setContext({
          ...state.context,
          redirectUrlPlugin: {
            data: createRedirects({ results, source, state }),
          },
        });
      });

      onSelect(({ state }) => {
        const redirects = getRedirectData({ state });
        if (redirects.length > 0) {
          setIsOpen(true);
        }
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
              if (source.getItemInputValue!.__default) {
                warn(
                  false,
                  `The source ${JSON.stringify(
                    source.sourceId
                  )} does not have a \`getItemInputValue\` function. It's required to be able to filter out the redirect item.` +
                    '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/#param-getiteminputvalue'
                );
                return true;
              }

              const itemInputValue = source.getItemInputValue!({
                item,
                state,
              });

              if (itemInputValue === undefined) {
                warn(
                  false,
                  `The source ${JSON.stringify(
                    source.sourceId
                  )} does not return a string from the \`getItemInputValue\` function. It's required to be able to filter out the redirect item.` +
                    '\nSee https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/#param-getiteminputvalue'
                );
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
        onSelect({
          event,
          item,
          state,
          navigator,
        }: OnSelectParams<RedirectUrlItem>) {
          onRedirect([item], { event, navigator, state });
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
          redirect:
            redirectSource as unknown as (typeof sourcesBySourceId)[string],
          ...sourcesBySourceId,
        },
        state,
      };
    },
    onSubmit({ event, navigator, state }: OnSubmitParams<RedirectUrlItem>) {
      onRedirect(getRedirectData({ state }), { event, navigator, state });
    },
    __autocomplete_pluginOptions: options,
  };
}
