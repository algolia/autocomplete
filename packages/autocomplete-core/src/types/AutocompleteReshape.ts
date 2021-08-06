import { BaseItem } from './AutocompleteApi';
import { AutocompleteSource } from './AutocompleteSource';
import { AutocompleteState } from './AutocompleteState';

export type AutocompleteReshapeSource<
  TItem extends BaseItem
> = AutocompleteSource<TItem> & {
  getItems(): TItem[];
};

export type AutocompleteReshapeSourcesBySourceId<
  TItem extends BaseItem
> = Record<string, AutocompleteReshapeSource<TItem>>;

export type Reshape<
  TItem extends BaseItem,
  TState extends AutocompleteState<TItem> = AutocompleteState<TItem>
> = (params: {
  sources: Array<AutocompleteReshapeSource<TItem>>;
  sourcesBySourceId: AutocompleteReshapeSourcesBySourceId<TItem>;
  state: TState;
}) => Array<AutocompleteReshapeSource<TItem>>;
