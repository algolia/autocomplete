// @ts-nocheck

import {
  AutocompleteState,
  AutocompleteSource,
  AutocompletePlugin,
} from '@algolia/autocomplete-js';

import { AutocompleteRedirectHit, RedirectHit } from './types';
import { OnSubmitParams } from "@algolia/autocomplete-core/src";

interface Redirect {
  url: string;
}

export type CreateRedirectPluginParams<
  TItem extends RedirectHit
> = {
  getSources(state: AutocompleteState<TItem>): any,
};

function handleRedirect(redirect?: Redirect) {
  console.log('handleRedirect', redirect);
  if (redirect?.url) {
    location.href = redirect.url;
  }
}

export function createRedirectPlugin<
  TItem extends AutocompleteRedirectHit
>(
  options: CreateRedirectPluginParams<TItem>
): AutocompletePlugin<TItem, undefined> {
  return {
    name: 'aa.redirectPlugin',
    getSources: (state) => {
      console.log('inside getSources');
      const sources = options.getSources(state).map((source) => {
        const { transformResponseToRedirect, transformResponse: originalTransformResponse, onSubmit: originalOnSubmit, ...otherOptions } = source;
        return {
          transformResponse: (response) => {
            console.log('transformed response in plugin', response)
            setContext({redirect: transformResponseToRedirect(response)});
            return originalTransformResponse(response);
          },
          onSubmit: (params: OnSubmitParams<any>) => {
            handleRedirect(params.state.context.redirect);
            return originalOnSubmit(params);
          },
          ...otherOptions,
        };
      });

      console.log('sources', sources)
      return sources;
    },
  };
}
