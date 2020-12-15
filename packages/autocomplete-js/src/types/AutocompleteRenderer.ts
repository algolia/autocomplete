import { BaseItem } from '@algolia/autocomplete-core';
import type { ComponentChildren, Fragment, VNode } from 'preact';

import { AutocompleteState } from './AutocompleteState';

export type AutocompleteRenderer<TItem extends BaseItem> = (
  params: {
    children: VNode;
    state: AutocompleteState<TItem>;
  },
  root: HTMLElement
) => void;

export type Pragma = (
  type: string | PragmaFrag,
  props: Record<string, any> | null,
  ...children: ComponentChildren[]
) => VNode;
export type PragmaFrag = typeof Fragment;
export type { VNode };
