import {
  AutocompletePlugin,
  AutocompleteReshapeSource,
  AutocompleteState,
  BaseItem,
} from '@algolia/autocomplete-core';

import { RedirectItem, RedirectPlugin } from './types';

export type CreateRedirectUrlPluginParams = {
  transformResponse?(response: any): RedirectItem[];
  onRedirect?(redirects: RedirectItem[]): void;
};

function defaultTransformResponse(response: any): string[] {
  return response.renderingContent?.redirect?.url ?? [];
}

function filterOutItemsMatchingQuery<TItem extends BaseItem>(
  source: AutocompleteReshapeSource<TItem>,
  state: AutocompleteState<TItem>
) {
  const items = source.getItems();
  source.getItems = () =>
    items.filter((item) => {
      const itemInputValue = source.getItemInputValue?.({ item, state });
      if (itemInputValue === undefined) {
        return true;
      }

      return itemInputValue.toLowerCase() !== state.query.toLowerCase();
    });
}

function defaultOnRedirect(redirects: RedirectItem[]) {
  const url = redirects[0]?.urls?.[0];

  console.log('onRedirect', url, redirects);
  // TODO: find a way to use `navigate`
  // if (url) {
  //   location.href = url;
  // }
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

    const redirects: RedirectItem[] = state.context.redirectUrlPlugin?.data ?? [];
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
    name: 'redirectUrlPlugin',
    subscribe({ onResolve, setContext }) {
      onResolve(({ results, source, state }) => {
        setContext({
          ...state.context,
          redirectUrlPlugin: {
            data: createRedirects({ results, source, state })
          },
        });
      });
    },
    reshape({ sources, state, sourcesBySourceId }) {
      const redirects = (state.context.redirectUrlPlugin as RedirectPlugin)?.data ?? [];

      for (const source of sources) {
        const redirect = redirects?.find(
          (redirect) => redirect.sourceId === source.sourceId
        );
        if (redirect === undefined) {
          continue;
        }

        filterOutItemsMatchingQuery(source, state);
      }

      for (const redirect of redirects) {
        const source = sourcesBySourceId[redirect.sourceId];
        if (source === undefined) {
          continue;
        }

        filterOutItemsMatchingQuery(source, state);
      }

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
        onSelect({ item }) {
          onRedirect([item]);
        },
        getItemInputValue() {
          return state.query;
        },
        onActive() {},
        getItems() {
          return (state.context.redirectUrlPlugin as RedirectPlugin).data as TItem[];
        },
      };
      return {
        sources: [redirectSource, ...sources],
        sourcesBySourceId: {
          ...sourcesBySourceId,
          redirect: redirectSource,
        },
        state,
      };
    },
    onSubmit({ state }) {
      onRedirect((state.context.redirectUrlPlugin as RedirectPlugin).data as TItem[]);
    },
  };
}
