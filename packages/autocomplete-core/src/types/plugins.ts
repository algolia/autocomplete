import {
  AutocompleteOptions,
  OnHighlightParams,
  OnSelectParams,
  BaseItem,
} from './api';
import { AutocompleteSetters } from './setters';

type PluginSubscriber<TParams> = (params: TParams) => void;

interface PluginSubscribeParams<TItem extends BaseItem>
  extends AutocompleteSetters<TItem> {
  onSelect(fn: PluginSubscriber<OnSelectParams<TItem>>): void;
  onHighlight(fn: PluginSubscriber<OnHighlightParams<TItem>>): void;
}

export type AutocompletePlugin<
  TItem extends BaseItem,
  TData = unknown
> = Partial<
  Pick<AutocompleteOptions<TItem>, 'onStateChange' | 'onSubmit' | 'getSources'>
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
