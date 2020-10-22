import { AutocompleteCollection } from './api';

export interface AutocompleteState<TItem> {
  highlightedIndex: number | null;
  query: string;
  completion: string | null;
  collections: Array<AutocompleteCollection<TItem>>;
  isOpen: boolean;
  status: 'idle' | 'loading' | 'stalled' | 'error';
  statusContext: {
    error?: Error;
  };
  context: { [key: string]: unknown };
}
