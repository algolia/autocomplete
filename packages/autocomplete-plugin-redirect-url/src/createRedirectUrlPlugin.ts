// @ts-nocheck

import {
  AutocompletePlugin,
  AutocompleteState,
  BaseItem,
  InternalAutocompleteOptions,
} from '@algolia/autocomplete-core';
import {AutocompleteSource, SourceTemplates} from "@algolia/autocomplete-js";
import { TransformResponseParams } from "@algolia/autocomplete-preset-algolia";
import { warn } from '@algolia/autocomplete-shared';

import { RedirectItem, RedirectPlugin } from './types';

export type OnRedirectOptions<TItem extends BaseItem> = {
  navigator: InternalAutocompleteOptions<TItem>['navigator'];
  state: AutocompleteState<TItem>;
};

export type TransformTemplatesOptions<TItem extends BaseItem> = {
  source: AutocompleteSource<TItem>;
  state: AutocompleteState<TItem>;
};

export type CreateRedirectUrlPluginParams = {
  transformResponse?<THit, TItem extends BaseItem>(response: TransformResponseParams<TItem>): RedirectItem[];
  onRedirect?<TItem extends BaseItem>(
    redirects: TItem[],
    options: OnRedirectOptions<TItem>,
  ): void;
  transformTemplates?<TItem extends BaseItem>(options: TransformTemplatesOptions<TItem>): SourceTemplates<any>;
};

function defaultTransformResponse<THit>(response: TransformResponseParams<THit>): string | undefined {
  return response.renderingContent?.redirect?.url;
}

function defaultTransformTemplates({ state }: TransformTemplatesOptions<RedirectItem>) {
  return {
    item() {
      return '->' + state.query;
    },
  };
}

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
  options: CreateRedirectUrlPluginParams = {}
): AutocompletePlugin<TItem> {
  const {
    transformResponse = defaultTransformResponse,
    transformTemplates = defaultTransformTemplates,
    onRedirect = defaultOnRedirect,
  } = options;

  function createRedirects({ results, source, state }): RedirectItem[] {
    const redirect: RedirectItem = {
      sourceId: source.sourceId,
      urls: results.flatMap((result) => transformResponse<TItem>(result)),
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

  let navigator: InternalAutocompleteOptions<TItem>['navigator'];

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
        (state.context.redirectUrlPlugin as RedirectPlugin)?.data ?? [];

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

      const redirectSource: AutocompleteSource<TItem> = {
        sourceId: 'redirectUrlPlugin',
        templates: transformTemplates({ state }),
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
          return (state.context.redirectUrlPlugin as RedirectPlugin)
            .data as TItem[];
        },
      };

      warn(
        sourcesBySourceId.redirect === undefined,
        'A source with `sourceId: "redirect"` already exists. This source will be overridden.]'
      );

      return {
        sourcesBySourceId: {
          redirect: redirectSource,
          ...sourcesBySourceId,
        },
        state,
      };
    },
    onSubmit({ state }) {
      onRedirect(
        (state.context.redirectUrlPlugin as RedirectPlugin).data as TItem[],
        { navigator, state }
      );
    }
  };
}
