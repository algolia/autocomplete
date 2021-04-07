import { AutocompleteScopeApi, BaseItem } from './AutocompleteApi';
import { AutocompleteOptions } from './AutocompleteOptions';
import { OnSelectParams, OnActiveParams } from './AutocompleteSource';

type PluginSubscriber<TParams> = (params: TParams) => void;

export interface PluginSubscribeParams<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  onSelect(fn: PluginSubscriber<OnSelectParams<TItem>>): void;
  onActive(fn: PluginSubscriber<OnActiveParams<TItem>>): void;
}

export type AutocompletePlugin<
  TItem extends BaseItem,
  TData = unknown
> = Partial<
  Pick<
    AutocompleteOptions<TItem>,
    'onStateChange' | 'onSubmit' | 'onReset' | 'getSources'
  >
> & {
  /**
   * The function called when Autocomplete starts.
   *
   * It lets you subscribe to lifecycle hooks and interact with the instance's state and context.
   */
  subscribe?(params: PluginSubscribeParams<TItem>): void;
  /**
   * An extra plugin object to expose properties and functions as APIs.
   */
  data?: TData;
};
