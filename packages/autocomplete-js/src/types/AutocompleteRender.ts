import { BaseItem } from '@algolia/autocomplete-core';

import { AutocompleteComponents } from './AutocompleteComponents';
import { Pragma, PragmaFrag, VNode } from './AutocompleteRenderer';
import { AutocompleteState } from './AutocompleteState';

export type AutocompleteRender<TItem extends BaseItem> = (
  params: {
    children: VNode;
    state: AutocompleteState<TItem>;
    sections: VNode[];
    elements: Record<string, VNode>;
    components: AutocompleteComponents;
    createElement: Pragma;
    Fragment: PragmaFrag;
  },
  root: HTMLElement
) => void;
