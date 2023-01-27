import { BaseItem } from '@algolia/autocomplete-core';

export interface RedirectState {
  sourceId: string;
  urls: string[];
}

export interface RedirectItem extends RedirectState, BaseItem {}
