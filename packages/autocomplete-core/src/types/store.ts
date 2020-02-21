import { AutocompleteState } from './state';

export interface AutocompleteStore<TItem> {
  state: AutocompleteState<TItem>;
  getState(): AutocompleteState<TItem>;
  send(action: ActionType, payload: any): void;
}

export type ActionType =
  | 'setHighlightedIndex'
  | 'setQuery'
  | 'setSuggestions'
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
