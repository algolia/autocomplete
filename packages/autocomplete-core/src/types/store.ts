import { InternalAutocompleteOptions } from './api';
import { AutocompleteState } from './state';

export interface AutocompleteStore<TItem> {
  getState(): AutocompleteState<TItem>;
  dispatch(action: ActionType, payload: any): void;
}

export type Reducer = <TItem>(
  state: AutocompleteState<TItem>,
  action: Action<TItem, any>
) => AutocompleteState<TItem>;

type Action<TItem, TPayload> = {
  type: ActionType;
  props: InternalAutocompleteOptions<TItem>;
  payload: TPayload;
};

type ActionType =
  | 'setSelectedItemId'
  | 'setQuery'
  | 'setCollections'
  | 'setIsOpen'
  | 'setStatus'
  | 'setContext'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Escape'
  | 'Enter'
  | 'submit'
  | 'reset'
  | 'focus'
  | 'blur'
  | 'mousemove'
  | 'mouseleave'
  | 'click';
