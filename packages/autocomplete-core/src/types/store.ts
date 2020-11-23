import { BaseItem, InternalAutocompleteOptions } from './api';
import { AutocompleteState } from './state';

export interface AutocompleteStore<TItem extends BaseItem> {
  getState(): AutocompleteState<TItem>;
  dispatch(action: ActionType, payload: any): void;
}

export type Reducer = <TItem extends BaseItem>(
  state: AutocompleteState<TItem>,
  action: Action<TItem, any>
) => AutocompleteState<TItem>;

type Action<TItem extends BaseItem, TPayload> = {
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
