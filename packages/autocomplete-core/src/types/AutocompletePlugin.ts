import { AutocompleteScopeApi, BaseItem } from './AutocompleteApi';
import { AutocompleteOptions } from './AutocompleteOptions';
import { OnSelectParams, OnActiveParams } from './AutocompleteSource';

type PluginSubscriber<TParams> = (params: TParams) => void;

interface PluginSubscribeParams<TItem extends BaseItem>
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
   * Function called when Autocomplete starts.
   *
   * It can be used to subscribe to lifecycle hooks or to interact with the
   * Autocomplete state and context.
   */
  subscribe?(params: PluginSubscribeParams<TItem>): void;
  /**
   * Extra plugin object to expose properties and functions as APIs.
   */
  data?: TData;
};
