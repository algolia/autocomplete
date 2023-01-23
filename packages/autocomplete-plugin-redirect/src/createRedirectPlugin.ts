// @ts-nocheck

import { OnSubmitParams } from '@algolia/autocomplete-core/src';
import {
  AutocompleteState,
  AutocompleteSource,
  AutocompletePlugin,
} from '@algolia/autocomplete-js';

import { AutocompleteRedirectHit, RedirectHit } from './types';

interface Redirect {
  url: string;
}

export type CreateRedirectPluginParams<TItem extends RedirectHit> = {
  getSources(state: AutocompleteState<TItem>): any;
};

function handleRedirect(redirect?: Redirect) {
  console.log('handleRedirect', redirect);
  if (redirect?.url) {
    location.href = redirect.url;
  }
}

export function createRedirectPlugin<TItem extends AutocompleteRedirectHit>(
  options: CreateRedirectPluginParams<TItem>
): AutocompletePlugin<TItem, undefined> {
  return {
    name: 'aa.redirectPlugin',
  };
}
