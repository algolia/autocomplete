import { BaseItem } from '@algolia/autocomplete-core';

export interface Redirect {
  url: string;
}

export interface RedirectState {
  sourceId: string;
  data: Redirect[];
}

export interface RedirectItem extends RedirectState, BaseItem {}
