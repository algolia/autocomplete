import {
  AutocompletePlugin,
  AutocompleteReshapeSource,
  AutocompleteState,
} from '@algolia/autocomplete-core';

import { RedirectItem, RedirectState } from './types';

export type CreateRedirectUrlPluginParams = {
  transformResponse?(response: any): RedirectItem[];
  onRedirect?(redirects: RedirectItem[]): void;
};

function defaultTransformResponse(response: any): RedirectItem[] {
  return response.renderingContent?.redirect ?? [];
}

// @ts-ignore
function filterOutItemsMatchingQuery(source: AutocompleteReshapeSource<TItem>, state: AutocompleteState<TItem>) {
  const items = source.getItems();
  source.getItems = () => items.filter((item) => {
    const itemInputValue = source.getItemInputValue?.({ item, state });
    if (itemInputValue === undefined) {
      return true;
    }

    return itemInputValue.toLowerCase() !== state.query.toLowerCase()
  });
}

function defaultOnRedirect(redirects: RedirectItem[]) {
  const url = redirects[0]?.data?.[0]?.url;

  console.log('onRedirect', url, redirects);
  // TODO: find a way to use `navigate`
  if (url) {
    location.href = url;
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
      data: results.flatMap((result) => transformResponse(result)),
    };

    const redirects: RedirectItem[] = state.context._redirects ?? [];
    const existingRedirectIndex = redirects.findIndex(
      (r) => r.sourceId === source.sourceId
    );

    if (existingRedirectIndex !== -1) {
      if (redirect.data.length === 0) {
        redirects.splice(existingRedirectIndex, 1);
      } else {
        redirects[existingRedirectIndex] = redirect;
      }
    } else if (redirect.data.length > 0) {
      redirects.push(redirect);
    }

    return redirects;
  }

  return {
    name: 'aa.redirectPlugin',
    subscribe({ onResolve, onSelect, setContext }) {
      onResolve(({ results, source, state }) => {
        setContext({
          ...state.context,
          _redirects: createRedirects({ results, source, state }),
        });
      });
    },
    reshape({ sources, state, sourcesBySourceId }) {
      const redirects = state.context._redirects as RedirectState[] ?? [];

      for (const source of sources) {
        const redirect = redirects?.find((redirect) => redirect.sourceId === source.sourceId);
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
        sourceId: 'redirect',
        // TODO: templates should be allowed (even required) here
        // it seems like AutocompleteReshapeSource is wrong
        // @ts-ignore
        templates: {
          item() {
            return '->' + state.query;
          },
        },
        getItemUrl({ item }) {
          return item.data[0].url;
        },
        onSelect({ item }) {
          onRedirect([item]);
        },
        getItemInputValue() {
          return state.query;
        },
        onActive() {},
        getItems() {
          return state.context._redirects as TItem[];
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
      onRedirect(state.context._redirects as TItem[]);
    },
  };
}
