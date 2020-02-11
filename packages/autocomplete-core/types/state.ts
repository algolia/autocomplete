import { AutocompleteSuggestion } from './api';

export interface AutocompleteState<TItem> {
  highlightedIndex: number;
  query: string;
  suggestions: Array<AutocompleteSuggestion<TItem>>;
  isOpen: boolean;
  status: 'idle' | 'loading' | 'stalled' | 'error';
  statusContext: {
    error?: Error;
  };
  context: { [key: string]: unknown };
}
