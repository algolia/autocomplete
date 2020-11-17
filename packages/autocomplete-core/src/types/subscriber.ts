import { OnHighlightParams, OnSelectParams } from './api';

export type Subscriber<TItem> = {
  onSelect(params: OnSelectParams<TItem>): void;
  onHighlight(params: OnHighlightParams<TItem>): void;
};

export type Subscribers<TItem> = Array<Partial<Subscriber<TItem>>>;
