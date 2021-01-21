import { BaseItem } from '@algolia/autocomplete-core';

import { Pragma, PragmaFrag, VNode } from './AutocompleteRenderer';
import { AutocompleteState } from './AutocompleteState';

export type AutocompleteRender<TItem extends BaseItem> = (
  params: {
    children: VNode;
    state: AutocompleteState<TItem>;
    sections: VNode[];
    createElement: Pragma;
    Fragment: PragmaFrag;
  },
  root: HTMLElement
) => void;
