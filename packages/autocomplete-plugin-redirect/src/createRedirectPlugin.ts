// @ts-nocheck

import { OnSubmitParams } from '@algolia/autocomplete-core/src';
import {
  AutocompleteState,
  AutocompleteSource,
  AutocompletePlugin,
} from '@algolia/autocomplete-js';

import { AutocompleteRedirectHit, RedirectHit } from './types';

// interface Redirect {
//   url: string;
// }

export type CreateRedirectPluginParams<TItem extends RedirectHit> = {
  getSources(state: AutocompleteState<TItem>): any;
};



export function createRedirectPlugin<TItem extends AutocompleteRedirectHit>(
  options: CreateRedirectPluginParams<TItem>
): AutocompletePlugin<TItem, undefined> {

  function handleRedirect(redirects: Record<string, string[]>) {
    console.log('handleRedirect', redirects);
    const flatRedirects = Object.keys()
    // if (redirect?.url) {
    //   location.href = redirect.url;
    // }
  }

  return {
    name: 'aa.redirectPlugin',
    subscribe({ onResolve, onSelect, setContext }) {
      onResolve(({ results, source, state }) => {
        setContext({
          _redirects: {
            ...state.context._redirects,
            [source.sourceId]: results.flatMap(
              (result) => result.renderingContent?.redirect?.url ?? []
            ),
          },
        });
        onSelect(({ state }) => {
          console.log('onSelect', state.context._redirects);
          handleRedirect(state.context._redirects);
        });
      });
    },
    // getSources({ state }) {
    //   return [
    //     {
    //       sourceId: 'redirect',
    //       templates: {
    //         item({ item }) {
    //           return '<>' + item.url;
    //         },
    //       },
    //       getItemUrl(item) {
    //         return item.url;
    //       },
    //       getItems() {
    //         console.log('getItems', state.context._redirects);
    //         // return state.context._redirects;

    //         return [
    //           {
    //             url: 'https://www.google.com',
    //           },
    //         ];
    //       },
    //     },
    //   ];
    // },

    onSubmit({ state }) {
      console.log('onSubmit', state.context._redirects);
      handleRedirect(state.context._redirects);
    },
    // getSources --> add the redirect
  };
}
