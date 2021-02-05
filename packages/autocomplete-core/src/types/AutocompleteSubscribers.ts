import { BaseItem } from './AutocompleteApi';
import { OnActiveParams, OnSelectParams } from './AutocompleteSource';

export type AutocompleteSubscriber<TItem extends BaseItem> = {
  onSelect(params: OnSelectParams<TItem>): void;
  onActive(params: OnActiveParams<TItem>): void;
};

export type AutocompleteSubscribers<TItem extends BaseItem> = Array<
  Partial<AutocompleteSubscriber<TItem>>
>;
