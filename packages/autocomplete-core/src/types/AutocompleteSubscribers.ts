import { BaseItem, OnActiveParams, OnResolveParams, OnSelectParams } from './';

export type AutocompleteSubscriber<TItem extends BaseItem> = {
  onSelect(params: OnSelectParams<TItem>): void;
  onActive(params: OnActiveParams<TItem>): void;
  onResolve(params: OnResolveParams<TItem>): void;
};

export type AutocompleteSubscribers<TItem extends BaseItem> = Array<
  Partial<AutocompleteSubscriber<TItem>>
>;
