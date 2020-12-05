import { BaseItem } from './AutocompleteApi';
import { OnHighlightParams, OnSelectParams } from './AutocompleteSource';

export type AutocompleteSubscriber<TItem extends BaseItem> = {
  onSelect(params: OnSelectParams<TItem>): void;
  onHighlight(params: OnHighlightParams<TItem>): void;
};

export type AutocompleteSubscribers<TItem extends BaseItem> = Array<
  Partial<AutocompleteSubscriber<TItem>>
>;
