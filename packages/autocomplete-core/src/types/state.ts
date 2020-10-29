import { AutocompleteCollection } from './api';

export interface AutocompleteState<TItem> {
  selectedItemId: number | null;
  query: string;
  completion: string | null;
  collections: Array<AutocompleteCollection<TItem>>;
  isOpen: boolean;
  status: 'idle' | 'loading' | 'stalled' | 'error';
  context: { [key: string]: unknown };
}
