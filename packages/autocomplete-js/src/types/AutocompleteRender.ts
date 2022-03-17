import { AutocompleteScopeApi, BaseItem } from '@algolia/autocomplete-core';

import { AutocompleteComponents } from './AutocompleteComponents';
import {
  ComponentChild,
  HTMLTemplate,
  Pragma,
  PragmaFrag,
  VNode,
} from './AutocompleteRenderer';
import { AutocompleteState } from './AutocompleteState';

export type AutocompleteRender<TItem extends BaseItem> = (
  params: AutocompleteScopeApi<TItem> & {
    children: VNode;
    state: AutocompleteState<TItem>;
    sections: VNode[];
    elements: Record<string, VNode>;
    components: AutocompleteComponents;
    createElement: Pragma;
    Fragment: PragmaFrag;
    html: HTMLTemplate;
    render(
      vnode: ComponentChild,
      containerNode: Element | Document | ShadowRoot | DocumentFragment,
      replaceNode?: Element | Text | undefined
    ): void;
  },
  root: HTMLElement
) => void;
