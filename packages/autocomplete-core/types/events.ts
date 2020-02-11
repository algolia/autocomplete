import { AutocompleteSetters } from './setters';
import { AutocompleteState } from './state';
import { AutocompleteSource } from './api';

export interface EventHandlerParams<TItem> extends AutocompleteSetters<TItem> {
  state: AutocompleteState<TItem>;
  event: Event;
}

export interface ItemEventHandlerParams<TItem>
  extends EventHandlerParams<TItem> {
  suggestion: TItem;
  suggestionValue: ReturnType<AutocompleteSource<TItem>['getInputValue']>;
  suggestionUrl: ReturnType<AutocompleteSource<TItem>['getSuggestionUrl']>;
  source: AutocompleteSource<TItem>;
}
