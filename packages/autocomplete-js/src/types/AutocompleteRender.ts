import { BaseItem } from '@algolia/autocomplete-core';

import { VNode } from './AutocompleteRenderer';
import { AutocompleteState } from './AutocompleteState';

export type AutocompleteRender<TItem extends BaseItem> = (
  params: {
    children: VNode;
    state: AutocompleteState<TItem>;
    sections: VNode[];
  },
  root: HTMLElement
) => void;
