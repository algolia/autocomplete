import { BaseItem, OnHighlightParams, OnSelectParams } from './api';

export type Subscriber<TItem extends BaseItem> = {
  onSelect(params: OnSelectParams<TItem>): void;
  onHighlight(params: OnHighlightParams<TItem>): void;
};

export type Subscribers<TItem extends BaseItem> = Array<
  Partial<Subscriber<TItem>>
>;
