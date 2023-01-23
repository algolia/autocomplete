import { AutocompletePlugin } from '@algolia/autocomplete-js';

import { AutocompleteRedirectHit, RedirectHit, RedirectState } from './types';

export type CreateRedirectPluginParams<TItem extends RedirectHit> = {
  transformResponseToRedirect?<TRedirect>(response): RedirectState[];
};

function createRedirects({ results, source, state }): RedirectState[] {
  const redirect: RedirectState = {
    sourceId: source.sourceId,
    data: results
      .flatMap((result) => result.renderingContent?.redirect)
      .filter((redirect) => redirect !== undefined),
  };

  const redirects: RedirectState[] = state.context._redirects ?? [];
  const existingRedirectIndex = redirects.findIndex((r) => r.sourceId === source.sourceId);
  if (existingRedirectIndex !== -1) {
    redirects[existingRedirectIndex] = redirect;
  } else {
    redirects.push(redirect);
  }

  return redirects;
}

export function createRedirectPlugin<TItem extends AutocompleteRedirectHit>(): AutocompletePlugin<TItem, undefined> {
  function handleRedirect(redirects: RedirectState[]) {
    console.log('handleRedirect', redirects);
    const url = redirects?.[0]?.data?.[0]?.url;
    // if (url) {
    //   location.href = url;
    // }
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
    // getSources({ state }) {
    //   return [
    //     {
    //       sourceId: 'redirect',
    //       templates: {
    //         item() {
    //           return '->' + state.query;
    //         },
    //       },
    //       getItemUrl(item) {
    //         return item.url;
    //       },
    //       onSelect() {
    //         handleRedirect(state.context._redirects);
    //       },
    //       getItems() {
    //         console.log('getItems', state.context._redirects);
    //         // return state.context._redirects;

    //         return [
    //           // {
    //           //   url: 'https://www.google.com',
    //           // },
    //         ];
    //       },
    //     },
    //   ];
    // },

    reshape({ sources, state }) {
      return [
        {
          sourceId: 'redirect',
          templates: {
            item() {
              return '->' + state.query;
            },
          },
          getItemUrl(item) {
            return item.url;
          },
          onSelect() {
            handleRedirect(state.context._redirects);
          },
          getItemInputValue(item) {
            return item.url;
          },
          onActive() {},
          getItems() {
            console.log('getItems', state.context._redirects);
            // return state.context._redirects;

            return [
              {
                url: 'https://www.google.com',
              },
            ];
          },
        },
        ...sources,
      ];
    },

    onSubmit({ state }) {
      console.log('onSubmit', state.context._redirects);
      handleRedirect(state.context._redirects);
    },
  };
}
