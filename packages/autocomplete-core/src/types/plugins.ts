import { AutocompleteOptions, AutocompleteSource, BaseItem } from './api';

export type AutocompletePlugin<
  TItem extends BaseItem,
  TData = unknown
> = Partial<
  Pick<AutocompleteOptions<TItem>, 'onStateChange' | 'onSubmit' | 'getSources'>
> & {
  /**
   * The subscribed properties are properties that are called when other sources
   * are interacted with.
   */
  subscribed?: {
    onSelect: AutocompleteSource<TItem>['onSelect'];
  };
  /**
   * An extra plugin specific object to store variables and functions
   */
  data?: TData;
};
