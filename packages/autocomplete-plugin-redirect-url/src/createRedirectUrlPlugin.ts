import {
  AutocompletePlugin,
  AutocompleteReshapeSource,
  AutocompleteState,
  InternalAutocompleteOptions,
} from '@algolia/autocomplete-core';
import {
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/autocomplete-preset-algolia/src/types';
import { warn } from '@algolia/autocomplete-shared';

import { RedirectItem, RedirectPlugin } from './types';

// TODO: should be ExecuteResponse + TItem[] etc. like in onResolve actually
type Response =
  | Array<
      SearchForFacetValuesResponse | SearchResponse<Record<string, unknown>>
    >
  | SearchForFacetValuesResponse
  | SearchResponse<Record<string, unknown>>;

export type CreateRedirectUrlPluginParams = {
  transformResponse?(response: Response): RedirectItem[];
  onRedirect?(
    redirects: RedirectItem[],
    options: {
      navigator: InternalAutocompleteOptions<RedirectItem>['navigator'];
      state: AutocompleteState<RedirectItem>;
    }
  ): void;
};

function defaultTransformResponse(response: Response): string | undefined {
  return response.renderingContent?.redirect?.url ?? undefined;
}

function defaultOnRedirect(
  redirects: RedirectItem[],
  {
    navigator,
    state,
  }: {
    navigator: InternalAutocompleteOptions<RedirectItem>['navigator'];
    state: AutocompleteState<RedirectItem>;
  }
) {
  const itemUrl = redirects[0]?.urls?.[0];

  console.log('onRedirect', itemUrl, redirects);
  if (itemUrl) {
    navigator.navigate({ itemUrl, item: redirects[0], state });
  }
}

export function createRedirectUrlPlugin<TItem extends RedirectItem>(
  options: CreateRedirectUrlPluginParams = {}
): AutocompletePlugin<TItem, unknown> {
  const {
    transformResponse = defaultTransformResponse,
    onRedirect = defaultOnRedirect,
  } = options;

  function createRedirects({ results, source, state }): RedirectItem[] {
    const redirect: RedirectItem = {
      sourceId: source.sourceId,
      urls: results.flatMap((result) => transformResponse(result)),
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

      const redirectSource: AutocompleteReshapeSource<TItem> = {
        sourceId: 'redirectUrlPlugin',
        // TODO: templates should be allowed (even required) here
        // it seems like AutocompleteReshapeSource is wrong
        // @ts-ignore
        templates: {
          item() {
            return '->' + state.query;
          },
        },
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
    },
  };
}
