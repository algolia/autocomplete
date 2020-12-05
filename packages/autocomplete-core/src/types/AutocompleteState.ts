import { BaseItem } from './AutocompleteApi';
import { AutocompleteCollection } from './AutocompleteCollection';

export interface AutocompleteState<TItem extends BaseItem> {
  selectedItemId: number | null;
  query: string;
  completion: string | null;
  collections: Array<AutocompleteCollection<TItem>>;
  isOpen: boolean;
  status: 'idle' | 'loading' | 'stalled' | 'error';
  context: { [key: string]: unknown };
}
