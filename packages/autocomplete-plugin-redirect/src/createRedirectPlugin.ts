import {
  AutocompletePlugin,
  AutocompleteReshapeSource,
} from '@algolia/autocomplete-core';

import { RedirectItem } from './types';

export type CreateRedirectPluginParams = {
  transformResponseToRedirect?(response: any): RedirectItem[];
  handleRedirect?(redirects: RedirectItem[]): void;
};

function defaultTransformResponse(response: any): RedirectItem[] {
  return response.renderingContent?.redirect ?? [];
}

function defaultHandleRedirect(redirects: RedirectItem[]) {
  const url = redirects[0]?.data?.[0]?.url;

  console.log('handleRedirect', url, redirects);
  // TODO: find a way to use `navigate`
  // if (url) {
  //   location.href = url;
  // }
}

export function createRedirectPlugin<TItem extends RedirectItem>(
  options: CreateRedirectPluginParams = {}
): AutocompletePlugin<TItem, unknown> {
  const {
    transformResponseToRedirect = defaultTransformResponse,
    handleRedirect = defaultHandleRedirect,
  } = options;

  function createRedirects({ results, source, state }): RedirectItem[] {
    const redirect: RedirectItem = {
      sourceId: source.sourceId,
      data: results.flatMap((result) => transformResponseToRedirect(result)),
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
          handleRedirect([item]);
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
      handleRedirect(state.context._redirects as TItem[]);
    },
  };
}
